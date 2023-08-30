import itsdangerous
import traceback
import jwt
import logging
import re
from flask import Flask, abort, g, make_response, request
from hhb_backend.auth.models import User
from jwt import InvalidTokenError
from time import time
from graphql import GraphQLError


class Auth():
    def __init__(self, app: Flask):
        self.logger = logger = logging.getLogger(__name__)
        self.audience = app.config.get("JWT_AUDIENCE", None)
        self.secret = app.config.get("JWT_SECRET", None)
        self.require_auth = app.config.get("REQUIRE_AUTH", True)

        self.logger.debug(
            f"JWT_SECRET {self.secret}, JWT_AUDIENCE {self.audience}")

        if self.require_auth != "0":
            if self.audience is None:
                self.logger.error("Missing environment variable JWT_AUDIENCE.")
                abort(500)

            if self.secret is None:
                self.logger.error("Missing environment variable JWT_SECRET.")
                abort(500)

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
        self.logger.debug(f"current user: {self.current_user}")

    def require_login(self, func):
        try:
            logging.info(f"auth-checking function: {func.__name__}")

            def wrapper(*args, **kwargs):
                if self.require_auth != "0":
                    self._init_auth()
                    if self.current_user == None:
                        return self._not_logged_in()
                return func(*args, **kwargs)

            wrapper.__name__ = func.__name__
            return wrapper
        except Exception as e:
            logging.error(e)
            logging.error(traceback.print_tb(e.__traceback__))
            raise GraphQLError("Something went wrong during the request")

    @property
    def current_user(self):
        return g.current_user if 'current_user' in g else None

    @current_user.setter
    def current_user(self, user):
        self.logger.debug(f"User saved in g: {user}")
        g.current_user = user
        self.logger.debug(f"User in g: {g.current_user}")

    @property
    def _exp(self) -> dict:
        return {"exp": int(time()) + self.exp_offset} if self.exp_offset >= 0 else {}

    def _get_token_from_cookie(self):
        return request.cookies.get('app-token', None)

    def _get_token_from_header(self):
        if 'authorization' in request.headers:
            token_search = re.search(
                'bearer (.*)', request.headers['authorization'], re.IGNORECASE)
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

        if token is not None:
            # try:
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiV2VyZGxlciwgQ2xhdWRpYSIsImVtYWlsIjoiY2xhdWRpYS53ZXJkbGVyQHV0cmVjaHQubmwiLCJmYW1pbHlfbmFtZSI6IldlcmRsZXIiLCJnaXZlbl9uYW1lIjoiQ2xhdWRpYSIsImlhdCI6MTY5MzMwMzIxNywiZXhwIjoxNjk1ODk1MjE3LCJhdWQiOiJodHRwczovL2h1aXNob3VkYm9la2plLnV0cmVjaHQubmwiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vYjllYTg3ZjctYTI2My00ZTY4LTk4ZTEtNWZhZDM1NDdhODA1L3YyLjAifQ.PuknCl-RsVRbCKtkun7LdM4eWP0e8ilv2RrNOizviCA"
            unverifiedToken = jwt.decode(
                token, options={"verify_signature": False})
            # except Exception as e:
            #     logging.error(e)
            #     logging.error(traceback.print_tb(e.__traceback__))
            self.logger.debug(
                f"""_user_loader: Token: {token}, claims: {unverifiedToken}""")
            try:
                # Try to decode and verify the token
                claims = jwt.decode(token, self.secret, algorithms=[
                                    'HS256'], audience=self.audience)
                email = claims.get('email', None)
                name = claims.get('name', None)
                if email and name:
                    user = User(email=email, name=name)
                    self.logger.debug(f"_user_loader: token user: {user}")
                    return user
            except InvalidTokenError as err:
                self.logger.warning("Invalid token")
                self.logger.debug(
                    f"""_user_loader: {err}; claims: {unverifiedToken}""")

        self.logger.debug(f"_user_loader: no user")
        return None
