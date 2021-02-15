import os

basedir = os.path.abspath(os.path.dirname(__file__))


class TestingConfig(object):
    CSRF_ENABLED = False
    DEBUG = False
    ENV = 'test'
    LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG")
    SECRET_KEY = "testing-secret"
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', None)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TESTING = True
