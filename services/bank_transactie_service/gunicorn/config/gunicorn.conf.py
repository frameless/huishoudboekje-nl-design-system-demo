import os
import logging


statsd_prefix = os.environ.get("STATSD_PREFIX", "hhb.banktransacties")
limit_request_line = int(os.environ.get("GUNICORN_LIMIT_REQUEST_LINE", "0"))

statsd_host = os.environ.get("STATSD_HOST", None)
bind = "0.0.0.0:" + os.environ.get("GUNICORN_PORT", "8000")
workers = int(os.environ.get("GUNICORN_WORKERS", "2"))
worker_class = os.environ.get("GUNICORN_WORKER_CLASS", "sync")
threads = int(os.environ.get("GUNICORN_THREADS", "1"))
loglevel = os.environ.get("GUNICORN_LOGLEVEL", "info")
capture_output = int(os.environ.get("GUNICORN_CAPTURE_OUTPUT", "1")) > 0
worker_tmp_dir = os.environ.get("GUNICORN_WORKER_TMP_DIR", "/dev/shm")

if threads > 1:
    logging.warning("[CONFIG WARNING] Number of hreads is greater then one, this can cause unexpected behaviour. This application is not thread-safe")

if loglevel == "debug":
    logging.warning("[CONFIG WARNING] Loglevel is set above warning, do not use this in production environments")