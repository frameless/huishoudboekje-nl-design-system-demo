import logging
import re
import secrets
import uuid
from datetime import datetime, timedelta
from time import time
from typing import List

import itsdangerous
import jwt
from flask import Flask, g, make_response, redirect, request, session
from flask_oidc import OpenIDConnect
from flask_rbac import RBAC, RoleMixin, UserMixin
from jwt import InvalidSignatureError, InvalidTokenError


class TokenProvider:
    def token(self, _user):
        return None


class Role(RoleMixin):
    def __init__(self, name=None):
        super().__init__(name)

    def __str__(self):
        return f"Role(name={self.get_name()})"


class User(UserMixin):
    def __init__(self, email: str = None, roles: List[str] = [], token_provider: TokenProvider = TokenProvider()):
        super().__init__(roles)
        self.email = email
        self.token_provider = token_provider

    def __str__(self):
        return f"User(email={self.email},roles={','.join([str(role) for role in self.roles])})"

    @property
    def token(self):
        return self.token_provider.token(self)


class Auth(TokenProvider):
    rbac: RBAC
    oidc: OpenIDConnect

    def __init__(self, app: Flask, anonymous_rolename: str = 'anonymous', default_rolename='user'):

        app.config.setdefault("RBAC_USE_WHITE", True)

        self.secret = app.config.get('AUTH_TOKEN_SECRET', None) or secrets.token_urlsafe(16)
        self.audience = app.config.get("AUTH_AUDIENCE", None) or "https://huishoudboekje.nlx.reviews"
        self.exp_offset = int(app.config.get("AUTH_EXP_OFFSET", None) or str(int(timedelta(days=7).total_seconds())))
        self.advertise = app.config.get("AUTH_ADVERTISE", None) or False

        logging.info(f"audience={self.audience},secret={self.secret}")
        oidc_overrides = {}
        oidc = OpenIDConnect(app, **oidc_overrides)

        rbac = RBAC(app,
                    role_model=Role,
                    user_model=User,
                    user_loader=self._user_loader,
                    permission_failed_hook=self._redirect_to_root,
                    )

        self.anonymous_rolename = anonymous_rolename
        self.default_rolename = default_rolename

        self.default_role = Role(default_rolename)
        self.anonymous_role = Role(anonymous_rolename)
        self.default_role.add_parent(self.anonymous_role)

        #
        app.before_request(self._init_auth)

        # Decorate the /oidc_callback route manually
        oidc._oidc_callback = rbac.exempt(oidc._oidc_callback)

        @app.errorhandler(itsdangerous.exc.BadSignature)
        def handle_bad_signature(_e):
            self.oidc.logout()
            session.clear()
            return self._not_logged_in()

        @app.route("/login")
        @rbac.exempt
        @oidc.require_login
        def login():
            return self._redirect_to_root()

        @app.route("/logout")
        @rbac.exempt
        def logout():
            oidc.logout()
            session.clear()
            return make_response(("ok", {"Content-Type": "text/plain"}))

        @app.route("/me")
        @rbac.exempt
        def me():
            if user := self.current_user:
                token = {"token": user.token} if self.advertise else {}
                return make_response({"email": user.email, **token})
            else:
                return self._not_logged_in()

        self.oidc = oidc
        self.rbac = rbac
        app.auth = self

    def _redirect_to_root(self):
        return redirect("/", code=302)

    def _not_logged_in(self):
        return make_response(({"message": "Not logged in"}, 401))

    def _init_auth(self):
        self.current_user = self._user_loader()

    @property
    def current_user(self):
        return g.current_user if 'current_user' in g else None

    @current_user.setter
    def current_user(self, user):
        g.current_user = user

    @property
    def _exp(self) -> dict:
        return {"exp": int(time()) + self.exp_offset} if self.exp_offset >= 0 else {}

    def token(self, user):
        payload = {
            "sub": user.email,
            "iat": int(time()),
            **self._exp,
            "iss": self.audience,
            "aud": self.audience,
            "jti": str(uuid.uuid4())
        }
        token = jwt.encode(
            payload=payload,
            key=self.secret,
            algorithm="HS256")
        logging.info(f"token={token}")
        return token

    def _user_loader(self):
        if self.current_user:
            return self.current_user

        if self.oidc.user_loggedin:
            logging.info(f"_user_loader oidc_id_token={g.oidc_id_token}")
            return self._default_role_user(self.oidc.user_getfield('email'))

        if 'authorization' in request.headers:
            logging.info(f"_user_loader: authorization={request.headers['authorization']}")
            token_search = re.search('bearer (.*)', request.headers['authorization'], re.IGNORECASE)

            if token_search:
                token = token_search.group(1)
                try:
                    claims = jwt.decode(token, self.secret, algorithms="HS256", audience=self.audience)
                    if email := claims.get('sub', None):
                        return self._default_role_user(email)
                except InvalidTokenError as err:
                    logging.warning(f"""_user_loader: {err}; claims: {jwt.decode(token, algorithms="HS256", options={"verify_signature": False})}""")

        logging.info(f"_user_loader: anonymous")
        return User(roles=[self.anonymous_role])

    def _default_role_user(self, email):
        return User(email=email, roles=[self.default_role], token_provider=self)
