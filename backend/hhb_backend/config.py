import json
import os
import re
import secrets
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))


def strip_quotes(s):
    return re.sub("""^(['"]?)(.*)(\\1)$""", "\\2", s)


class Config(object):
    AUTH_ADVERTISE = os.getenv("AUTH_ADVERTISE", None)
    AUTH_AUDIENCE = os.getenv("AUTH_AUDIENCE", None)
    AUTH_EXP_OFFSET = os.getenv("AUTH_EXP_OFFSET", None)
    AUTH_TOKEN_SECRET = os.getenv("AUTH_TOKEN_SECRET", None)
    CSRF_ENABLED = True
    DEBUG = False
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    DEVELOPMENT = False
    TESTING = False
    PREFIX = os.environ.get('PREFIX', '/api')
    SESSION_COOKIE_NAME = "flask_session"
    SESSION_COOKIE_PATH = os.getenv('PREFIX', '/api')
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    SECRET_KEY = os.getenv('SECRET_KEY', None) or secrets.token_urlsafe(16)
    OIDC_CLIENT_SECRETS = os.getenv('OIDC_CLIENT_SECRETS', './etc/client_secrets.json')
    OIDC_SCOPES = ['openid', 'email', 'profile', 'offline_access']
    OIDC_ID_TOKEN_COOKIE_SECURE = True
    OIDC_CLOCK_SKEW = float(strip_quotes(os.getenv('OIDC_CLOCK_SKEW', "60")))
    # OIDC_ID_TOKEN_COOKIE_PATH = os.getenv('PREFIX', '/') # This is broken in Flask-OIDC


class ProductionConfig(Config):
    SECRET_KEY = os.getenv('SECRET_KEY')
    SESSION_COOKIE_SECURE = True
    OIDC_ID_TOKEN_COOKIE_SECURE = True


class StagingConfig(Config):
    AUTH_ADVERTISE = os.getenv("AUTH_ADVERTISE", True)
    AUTH_EXP_OFFSET = os.getenv("AUTH_EXP_OFFSET", "-1")
    AUTH_TOKEN_SECRET = os.getenv("AUTH_TOKEN_SECRET", os.getenv("SECRET_KEY", None))
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


class TestingConfig(LocalConfig):
    SECRET_KEY = "testing-secret"
    TESTING = True
