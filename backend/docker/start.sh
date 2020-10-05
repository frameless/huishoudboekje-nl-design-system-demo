#!/bin/bash

export PYTHONUNBUFFERED=TRUE

exec gunicorn \
  --workers=${WORKERS} \
  --threads=${THREADS} \
  --bind=0.0.0.0:${PORT} \
  --log-level=info \
  --capture-output \
  --worker-class=gthread \
  hhb_backend.app:app