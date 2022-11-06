ARG DOCKER_PROXY=''

FROM ${DOCKER_PROXY}bitnami/python:3.10.7

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get -y install tzdata
ENV TZ=Europe/Amsterdam

WORKDIR /app
RUN mkdir -p hhb_backend/
COPY setup.py /app
RUN pip install .
COPY . /app

# Set gunicorn settings
ENV GUNICORN_PORT="8000" \
    GUNICORN_WORKERS="2" \
    GUNICORN_THREADS="4" \
    GUNICORN_LOGLEVEL="info" \
    PYTHONDONTWRITEBYTECODE="1" \
    PYTHONUNBUFFERED="1" \
    PATH="/app/.local/bin:${PATH}" \
    APP_NAME="wsgi:app"

# Runtime envrionment
CMD ["bash", "-c", "exec gunicorn \
  --bind=0.0.0.0:${GUNICORN_PORT} \
  --workers=${GUNICORN_WORKERS} \
  --threads=${GUNICORN_THREADS} \
  --log-level=${GUNICORN_LOGLEVEL} \
  --forwarded-allow-ips '*' \
  --capture-output \
  --worker-class=gthread \
  --worker-tmp-dir /dev/shm \
  ${APP_NAME}"]
