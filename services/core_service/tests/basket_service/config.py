import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG")
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', None)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
