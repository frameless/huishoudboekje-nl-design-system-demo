import os
import re

basedir = os.path.abspath(os.path.dirname(__file__))


def strip_quotes(s):
    return re.sub("""^(['"]?)(.*)(\\1)$""", "\\2", s)


class Config(object):
    JWT_AUDIENCE = os.getenv("JWT_AUDIENCE", None)
    JWT_SECRET = os.getenv("JWT_SECRET", None)
    JWT_ALGORITHMS = os.getenv("JWT_ALGORITHMS", None)
    LOG_LEVEL = os.getenv("LOG_LEVEL", "WARNING")
    PREFIX = os.environ.get('PREFIX', '/api')
    REQUIRE_AUTH = os.getenv("REQUIRE_AUTH", True)
    USE_GRAPHIQL = os.getenv("USE_GRAPHIQL", False)
    ALLOW_INTROSPECTION = os.getenv("ALLOW_INTROSPECTION", False)
