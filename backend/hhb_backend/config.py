import json
import os
import re
import secrets

basedir = os.path.abspath(os.path.dirname(__file__))


def strip_quotes(s):
    return re.sub("""^(['"]?)(.*)(\\1)$""", "\\2", s)


class Config(object):
    CSRF_ENABLED = True
    DEBUG = False
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    DEVELOPMENT = False
    TESTING = False
    GRAPHQL_AUTH_ENABLED = True
    PREFIX = os.environ.get('PREFIX', '/api')
    SESSION_COOKIE_NAME = "flask_session"
    SESSION_COOKIE_PATH = os.getenv('PREFIX', '/api')
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    SECRET_KEY = os.getenv('SECRET_KEY', None) or secrets.token_urlsafe(16)
    OIDC_CLIENT_SECRETS = os.getenv('OIDC_CLIENT_SECRETS', './etc/client_secrets.json')
    OIDC_SCOPES = ['openid', 'email', 'profile']
    OIDC_ID_TOKEN_COOKIE_SECURE = True
    OIDC_CLOCK_SKEW = float(strip_quotes(os.getenv('OIDC_CLOCK_SKEW', "60")))
    # OIDC_ID_TOKEN_COOKIE_PATH = os.getenv('PREFIX', '/') # This is broken in Flask-OIDC
    OVERWITE_REDIRECT_URI_MAP = os.getenv('OVERWITE_REDIRECT_URI_MAP', None)


class ProductionConfig(Config):
    SECRET_KEY = os.getenv('SECRET_KEY')
    SESSION_COOKIE_SECURE = True
    OIDC_ID_TOKEN_COOKIE_SECURE = True


class StagingConfig(Config):
    GRAPHQL_AUTH_ENABLED = False
    SESSION_COOKIE_SECURE = True
    OIDC_ID_TOKEN_COOKIE_SECURE = True


class LocalConfig(StagingConfig):
    LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG")
    SESSION_COOKIE_SECURE = False
    OIDC_ID_TOKEN_COOKIE_SECURE = False


class DevelopmentConfig(LocalConfig):
    DEBUG = True
    DEVELOPMENT = True
    SECRET_KEY = os.getenv('SECRET_KEY', None) or 'development'
    PREFIX = '/api'
    OVERWITE_REDIRECT_URI_MAP = os.getenv('OVERWITE_REDIRECT_URI_MAP', None) or json.dumps(
        {"http://localhost:3000": "http://localhost:3000/api/custom_oidc_callback"})


class TestingConfig(LocalConfig):
    SECRET_KEY = "testing-secret"
    TESTING = True
