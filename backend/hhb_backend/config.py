import os
import re

basedir = os.path.abspath(os.path.dirname(__file__))


def strip_quotes(s):
    return re.sub("""^(['"]?)(.*)(\\1)$""", "\\2", s)


class Config(object):
    JWT_AUDIENCE = os.getenv("JWT_AUDIENCE", None)
    JWT_SECRET = os.getenv("JWT_SECRET", None)
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
