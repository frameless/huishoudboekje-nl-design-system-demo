import logging
import re
from time import time

import itsdangerous
import jwt
from flask import Flask, g, make_response, request
from hhb_backend.auth.models import User
from jwt import InvalidTokenError


class Auth():
    def __init__(self, app: Flask):
        self.logger = logger = logging.getLogger(__name__)
        self.audience = app.config.get("JWT_AUDIENCE", None)
        self.secret = app.config.get("JWT_SECRET", None)

        self.logger.debug(f"JWT_SECRET {self.secret}, JWT_AUDIENCE {self.audience}")

        if self.audience is None:
            self.logger.error("Missing environment variables JWT_AUDIENCE.")
            # Todo: crash the app
            raise RuntimeError()

        if self.secret is None:
            self.logger.error("Missing environment variables JWT_SECRET.")
            # Todo: crash the app
            raise RuntimeError()

        self.logger.debug(f"3")

        app.before_request(self._init_auth)

        @app.errorhandler(itsdangerous.exc.BadSignature)
        def handle_bad_signature(_e):
            self.logger.debug("handle_bad_signature")
            return self._not_logged_in()

        app.auth = self

    def _not_logged_in(self):
        return make_response(({"message": "Not logged in"}, 401))

    def _init_auth(self):
        self.logger.debug("init_auth")
        self.current_user = self._user_loader()
        if self.current_user == None:
            return self._not_logged_in()

    @property
    def current_user(self):
        return g.current_user if 'current_user' in g else None

    @current_user.setter
    def current_user(self, user):
        g.current_user = user

    @property
    def _exp(self) -> dict:
        return {"exp": int(time()) + self.exp_offset} if self.exp_offset >= 0 else {}

    def _get_token_from_cookie(self):
        return request.cookies.get('app-token', None)

    def _get_token_from_header(self):
        if 'authorization' in request.headers:
            token_search = re.search('bearer (.*)', request.headers['authorization'], re.IGNORECASE)
            if token_search:
                token = token_search.group(1)
                self.logger.debug(f"_token_loader: Bearer found: {token}")
                return token

        return None

    def _token_loader(self):
        token_cookie = self._get_token_from_cookie()
        token_header = self._get_token_from_header()

        token = token_cookie or token_header or None
        self.logger.debug(f"_token_loader: Token: {token}")
        return token

    def _user_loader(self):
        token = self._token_loader()

        unverifiedToken = jwt.decode(token, options={"verify_signature": False})
        self.logger.debug(f"""_user_loader: Token: {token}, claims: {unverifiedToken}""")

        if token is not None:
            try:
                # Try to decode and verify the token
                claims = jwt.decode(token, self.secret, algorithms=['HS256'], audience=self.audience)
                email = claims.get('email', None)
                name = claims.get('name', None)
                if email and name:
                    user = User(email=email, name=name)
                    self.logger.debug(f"_user_loader: token user: {user}")
                    return user
            except InvalidTokenError as err:
                self.logger.warning(f"""_user_loader: {err}; claims: {unverifiedToken}""")

        self.logger.debug(f"_user_loader: no user")
        return None
