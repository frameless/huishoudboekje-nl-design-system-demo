import os

statsd_host = os.environ.get("GUNICORN_STATSD_HOST", None)
statsd_prefix = os.environ.get("GUNICORN_STATSD_PREFIX", "hhb.huishoudboekje")