import json
import os
import re
import secrets
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))


def strip_quotes(s):
    return re.sub("""^(['"]?)(.*)(\\1)$""", "\\2", s)


class Config(object):
    AUTH_AUDIENCE = os.getenv("AUTH_AUDIENCE", None)
    CSRF_ENABLED = True
    DEBUG = False
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    DEVELOPMENT = False
    TESTING = False
    PREFIX = os.environ.get('PREFIX', '/api')

class ProductionConfig(Config):
    LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG") # niet vergeten te verwijderen

class DevelopmentConfig(Config):
    DEBUG = True
    DEVELOPMENT = True
    PREFIX = '/api'
    LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG")


class TestingConfig(Config):
    DEVELOPMENT = True
    TESTING = True
    LOG_LEVEL = os.getenv("LOG_LEVEL", "ERROR")
