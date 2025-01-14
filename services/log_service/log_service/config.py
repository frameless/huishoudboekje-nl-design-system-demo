import os
from core_service.utils import get_pool_class

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    LOG_LEVEL = os.getenv("LOG_LEVEL", "WARNING")
    STATSD_HOSTPORT = os.getenv("STATSD_HOST", None)
    STATSD_PREFIX = os.getenv("STATSD_PREFIX", "hhb.log")
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', None)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DATABASE_POOL_PRE_PING = int(os.getenv('DATABASE_POOL_PRE_PING', "1")) > 0
    DATABASE_POOL_CLASS = get_pool_class(os.getenv('DATABASE_POOL_CLASS', None))
    DATABASE_POOL_SIZE = int(os.getenv('DATABASE_POOL_SIZE', "10"))
    DATABASE_POOL_MAX_OVERFLOW = int(os.getenv('DATABASE_POOL_MAX_OVERFLOW', "5"))
    DATABASE_POOL_RECYCLE = int(os.getenv('DATABASE_POOL_RECYCLE', "590"))
    DATABASE_LOG_HANDLE_ERROR_EVENT = int(os.getenv('DATABASE_LOG_HANDLE_ERROR_EVENT', "0")) > 0

    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": DATABASE_POOL_PRE_PING,
        "poolclass": DATABASE_POOL_CLASS,
        "pool_size": DATABASE_POOL_SIZE,
        "max_overflow": DATABASE_POOL_MAX_OVERFLOW,
        "pool_recycle": DATABASE_POOL_RECYCLE
    }

