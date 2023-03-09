import os
import re

basedir = os.path.abspath(os.path.dirname(__file__))


def strip_quotes(s):
    return re.sub("""^(['"]?)(.*)(\\1)$""", "\\2", s)


class Config(object):
    JWT_AUDIENCE = os.getenv("JWT_AUDIENCE", None)
    JWT_SECRET = os.getenv("JWT_SECRET", None)
    LOG_LEVEL = os.getenv("LOG_LEVEL", "WARNING")
    PREFIX = os.environ.get('PREFIX', '/api')
    REQUIRE_AUTH = os.getenv("REQUIRE_AUTH", True)
