import logging
import re
import secrets
import uuid
from datetime import timedelta
from time import time

import itsdangerous
import jwt
from isodate import parse_duration
from flask import Flask, g, make_response, redirect, request, session
from flask_oidc import OpenIDConnect
from flask_rbac import RBAC
from itsdangerous import TimedJSONWebSignatureSerializer
from jwt import InvalidTokenError

from hhb_backend.auth.models import Role, User
from hhb_backend.auth.token_provider import TokenProvider


class Auth(TokenProvider):
    rbac: RBAC
    oidc: OpenIDConnect

    def __init__(self, app: Flask, anonymous_rolename: str = 'anonymous', default_rolename='user'):
        self.logger = logger = logging.getLogger(__name__)

        app.config.setdefault("RBAC_USE_WHITE", True)

        self.secret = app.config.get('AUTH_TOKEN_SECRET', None) or secrets.token_urlsafe(16)
        self.audience = app.config.get("AUTH_AUDIENCE", None) or "https://huishoudboekje.nlx.reviews"
        self.exp_offset = int(app.config.get("AUTH_EXP_OFFSET", None) or str(int(timedelta(days=7).total_seconds())))
        self.advertise = app.config.get("AUTH_ADVERTISE", None) or False
        self.oidc_id_token_max_expires = app.config.get('OIDC_ID_TOKEN_MAX_EXPIRES', None) or 'PT1H'

        logger.info(f"audience={self.audience}, exp_offset={self.exp_offset}, advertise={self.advertise}, oidc_id_token_max_expires={self.oidc_id_token_max_expires}")
        oidc = OpenIDConnect(app)
        oidc.cookie_serializer = TimedJSONWebSignatureSerializer(
            self.secret, expires_in=int(parse_duration(self.oidc_id_token_max_expires).total_seconds()))

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
            self._logout()
            return self._not_logged_in()

        @app.route("/login")
        @rbac.exempt
        @oidc.require_login
        def login():
            return self._redirect_to_root()

        @app.route("/logout")
        @rbac.exempt
        def logout():
            self._logout()
            return make_response(("ok", {"Content-Type": "text/plain"}))

        @app.route("/me")
        @rbac.exempt
        def me():
            if self.current_user and self.current_user.is_authenticated:
                user = self.current_user
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

    def _logout(self):
        self.oidc.logout()
        session.clear()

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
        self.logger.info(f"token={token}")
        return token

    def _user_loader(self):
        if self.current_user:
            return self.current_user

        self.logger.debug(f"_user_loader: oidc_id_token={g.oidc_id_token}, authorization={request.headers.get('authorization', None)}")
        if self.oidc.user_loggedin:
            user = self._default_role_user(self.oidc.user_getfield('email'))
            self.logger.debug(f"_user_loader: oidc user: {user}")
            return user

        if 'authorization' in request.headers:
            token_search = re.search('bearer (.*)', request.headers['authorization'], re.IGNORECASE)

            if token_search:
                token = token_search.group(1)
                try:
                    claims = jwt.decode(token, self.secret, algorithms="HS256", audience=self.audience)
                    if email := claims.get('sub', None):
                        user = self._default_role_user(email)
                        self.logger.debug(f"_user_loader: token user: {user}")
                        return user
                except InvalidTokenError as err:
                    self.logger.warning(f"""_user_loader: {err}; claims: {jwt.decode(token, algorithms="HS256", options={"verify_signature": False})}""")

        self.logger.debug(f"_user_loader: anonymous user")
        return User(roles=[self.anonymous_role], is_authenticated=False)

    def _default_role_user(self, email):
        return User(email=email, roles=[self.default_role], token_provider=self)
