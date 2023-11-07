import logging
import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    LOG_LEVEL = os.getenv("LOG_LEVEL", "WARNING")
    STATSD_HOSTPORT = os.getenv("STATSD_HOST", None)
    STATSD_PREFIX = os.getenv("STATSD_PREFIX", "hhb.grootboek")
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', None)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True
    }
