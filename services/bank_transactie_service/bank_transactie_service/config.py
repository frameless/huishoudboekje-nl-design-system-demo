import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = os.getenv('JWT_SECRET', None)
    SQLALCHEMY_DATABASE_URI = os.getenv('TRANSACTIE_DATABASE_URL', os.getenv('DATABASE_URL', None))
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")


class ProductionConfig(Config):
    DEBUG = False


class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True
    LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG")


class TestingConfig(Config):
    DEBUG = False
    TESTING = True
    CSRF_ENABLED = False
    SECRET_KEY = "testing-secret"
    ENV = 'test'
    LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG")
