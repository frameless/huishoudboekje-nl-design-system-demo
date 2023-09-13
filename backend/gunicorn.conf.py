import os

statsd_host = os.environ.get("STATSD_HOST", None)
statsd_prefix = os.environ.get("STATSD_PREFIX", "hhb.backend")