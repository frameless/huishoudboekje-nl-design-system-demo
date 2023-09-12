ARG DOCKER_PROXY=''

FROM ${DOCKER_PROXY}bitnami/python:3.10.7

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get -y install tzdata
ENV TZ=Europe/Amsterdam

WORKDIR /app

COPY ./bank_transactie_service/setup.py /app

COPY ./bank_transactie_service /app
COPY ./core_service/core_service /app/core_service

RUN pip install .

ENV GUNICORN_PORT="8000" \
    GUNICORN_WORKERS="2" \
    GUNICORN_THREADS="4" \
    GUNICORN_LIMIT_REQUEST_LINE="0" \
    GUNICORN_LOGLEVEL="info" \
    PYTHONDONTWRITEBYTECODE="1" \
    PYTHONUNBUFFERED="1" \
    PATH="/app/.local/bin:${PATH}" \
    APP_NAME="wsgi:app"

CMD ["bash", "-c", "exec gunicorn \
  -c gunicorn.conf.py \
  --bind=0.0.0.0:${GUNICORN_PORT} \
  --workers=${GUNICORN_WORKERS} \
  --threads=${GUNICORN_THREADS} \
  --limit-request-line=${GUNICORN_LIMIT_REQUEST_LINE} \
  --log-level=${GUNICORN_LOGLEVEL} \
  --capture-output \
  --worker-class=gthread \
  --worker-tmp-dir /dev/shm \
  ${APP_NAME}"]
