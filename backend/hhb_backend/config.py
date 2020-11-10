import os
import secrets

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = False
    DEVELOPMENT = False
    TESTING = False
    GRAPHQL_AUTH_ENABLED = True
    PREFIX = os.environ.get('PREFIX', None)
    SESSION_COOKIE_NAME = "flask_session"
    SESSION_COOKIE_PATH = os.getenv('PREFIX', None)
    SECRET_KEY = os.getenv('SECRET_KEY', None)
    OIDC_CLIENT_SECRETS = os.getenv('OIDC_CLIENT_SECRETS', './etc/client_secrets.json')
    OIDC_SCOPES = ['openid', 'email', 'groups', 'profile']
    OIDC_ID_TOKEN_COOKIE_SECURE = os.getenv('OIDC_ID_TOKEN_COOKIE_SECURE', False)
    OVERWITE_REDIRECT_URI_MAP = os.getenv('OVERWITE_REDIRECT_URI_MAP', None)


class ProductionConfig(Config):
    OIDC_ID_TOKEN_COOKIE_SECURE = os.getenv('OIDC_ID_TOKEN_COOKIE_SECURE', True)
    SECRET_KEY = os.getenv('SECRET_KEY')


class StagingConfig(Config):
    GRAPHQL_AUTH_ENABLED = False


class DevelopmentConfig(StagingConfig):
    DEVELOPMENT = True
    DEBUG = True
    SECRET_KEY = os.getenv('SECRET_KEY', None) or secrets.token_urlsafe(16)


class TestingConfig(StagingConfig):
    TESTING = True
    SECRET_KEY = "testing-secret"
