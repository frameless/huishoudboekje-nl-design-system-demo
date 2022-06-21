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
from itsdangerous import TimedJSONWebSignatureSerializer
from jwt import InvalidTokenError

from hhb_backend.auth.models import User


class Auth():
    def __init__(self, app: Flask, anonymous_rolename: str = 'anonymous', default_rolename='user'):
        self.logger = logger = logging.getLogger(__name__)

        self.audience = app.config.get("AUTH_AUDIENCE", None) or "https://huishoudboekje.nlx.reviews"

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

    def _user_loader(self):
        if self.current_user:
            return self.current_user

        # self.logger.debug(f"_user_loader: oidc_id_token={g.oidc_id_token}, authorization={request.headers.get('authorization', None)}")
        if 'authorization' in request.headers:
            token_search = re.search('bearer (.*)', request.headers['authorization'], re.IGNORECASE)

            if token_search:
                token = token_search.group(1)
                
        else: 
            #iets met een cookie waarde van token zit in app-token 
            self.logger.debug("Todo, find token in cookie.")
            token = ""

        if token:
            try:
                claims = jwt.decode(token, self.secret, algorithms="HS256", audience=self.audience)
                if email := claims.get('email', None):
                    if name := claims.get('name', None):
                        user = User(email=email, name=name)
                        self.logger.debug(f"_user_loader: token user: {user}")
                        return user
            except InvalidTokenError as err:
                self.logger.warning(f"""_user_loader: {err}; claims: {jwt.decode(token, algorithms="HS256", options={"verify_signature": False})}""")

        self.logger.debug(f"_user_loader: no user")
        return None
