import itsdangerous
import traceback
import requests
import jwt
import logging
import re
import base64
from cryptography.x509 import load_pem_x509_certificate
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend
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
        self.issuer = app.config.get("JWT_ISSUER", None)
        self.supported_algorithms = app.config.get(
            "JWT_ALGORITHMS", None).strip().upper().split(',')
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
            if self.supported_algorithms is None:
                self.logger.error(
                    "Missing environment variable JWT_ALGORITHMS")
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

        token = token_cookie or None
        self.logger.debug(f"_token_loader: Token: {token}")
        return token

    def _user_loader(self):
        token = self._token_loader()

        if token is not None:
            try:
                unverifiedToken = jwt.decode(
                    token, options={"verify_signature": False})
            except Exception as e:
                logging.error(e)
                logging.error(traceback.print_tb(e.__traceback__))
                self.logger.debug(
                    f"""_user_loader: Token: {token}, claims: {unverifiedToken}""")
            try:
                # Try to decode and verify the token
                secret = self._public_key_or_secret(token)
                if secret != None:
                    logging.info(self.supported_algorithms)
                    claims = jwt.decode(
                        token, secret, algorithms=self.supported_algorithms, audience=self.audience, issuer=self.issuer)
                    email = claims.get('email', None)
                    name = claims.get('name', None)
                    if email and name:
                        user = User(email=email, name=name)
                        self.logger.debug(f"_user_loader: token user: {user}")
                        return user
            except InvalidTokenError as err:
                self.logger.error(err)
                self.logger.warning("Invalid token")
                self.logger.debug(
                    f"""_user_loader: {err}; claims: {unverifiedToken}""")

        self.logger.debug(f"_user_loader: no user")
        return None

    def _determine_alg_used(self, token):
        header = jwt.get_unverified_header(token)
        alg = header.get("alg")
        return alg

    def _get_KID_from_token(self, token):
        return jwt.get_unverified_header(token).get("kid")

    def _public_key_or_secret(self, token):
        alg = self._determine_alg_used(token)
        self.logger.info(alg)
        if (alg in ['HS256', 'HS384', 'HS512']):
            self.logger.info('wrong location sir')
            return self.secret
        else:
            return self._get_public_key_from_oidc(token)

    def _get_oidc_config_uri(self):
        return f'{self.issuer}{"" if self.issuer.endswith("/") else "/"}.well-known/openid-configuration'

    def _get_jwks_uri_from_config(self, config_uri):
        try:
            config_data = requests.get(config_uri).json()
            jwks_uri = config_data.get('jwks_uri', None)
            if jwks_uri == None:
                self.logger.info("JWKS endpoint not found for issuer")
            return jwks_uri
        except requests.exceptions.RequestException as e:
            self.logger.error(f'Error trying to fetch oidc configuration: {e}')
            return None
        except jwt.DecodeError as e:
            self.logger.error(
                f"Error trying to decode openid-configuration: {e}")
            return None

    def _get_public_key_from_oidc(self, token):
        jwks_uri = self._get_jwks_uri_from_config(self._get_oidc_config_uri())
        if jwks_uri != None:
            try:
                jwks_keys = requests.get(jwks_uri).json().get('keys', [])
                kid = self._get_KID_from_token(token)
                public_key = None
                for key in jwks_keys:
                    if key.get('kid') == kid:
                        public_key = key
                        self.logger.info(f"key: {key}")
                        break
                if public_key == None:
                    self.logger.info(f"public key not found for KID: {kid}")
                self.logger.info(public_key)
                return public_key
            except requests.exceptions.RequestException as e:
                self.logger.error(
                    f"Error trying to get keys from JWKS endpoint: {e}")
                return None
            except jwt.DecodeError as e:
                self.logger.error(
                    f"Error trying to decode JWKS keys: {e}")
                return None
        return None

    def _format_key_to_PEM(self, key):
        n = int.from_bytes(base64.urlsafe_decode(key['n']), byteorder='big')
        e = int.from_bytes(base64.urlsafe_decode(key['e']), byteorder='big')

        public_numbers = rsa.RSAPublicNumbers(n, e)
        public_key_pem = public_numbers.public_key(backend=default_backend())
        public_key_pem_bytes = public_key_pem.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        return public_key_pem_bytes
