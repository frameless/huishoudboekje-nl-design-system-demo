FROM python:3.8-slim-buster

# set the working directory in the container
RUN useradd --home-dir /app --create-home --shell /bin/bash app
USER app
WORKDIR /app

# install the dependencies only for fast rebuilds
COPY --chown=app:app bank_transactie_service/setup.py ./
RUN mkdir -p core_service bank_transactie_service models && \
    python3 setup.py install --user --prefix=''

# copy the content of the local src directory to the working directory
COPY --chown=app:app ./bank_transactie_service ./
COPY --chown=app:app ./core_service/core_service /app/core_service

# install the package
RUN python3 setup.py install --user --prefix=''

# Set gunicorn settings
ENV GUNICORN_PORT="8000" \
    GUNICORN_WORKERS="2" \
    GUNICORN_THREADS="4" \
    GUNICORN_LOGLEVEL="info" \
    PYTHONDONTWRITEBYTECODE="1" \
    PYTHONUNBUFFERED="1" \
    PATH="/app/.local/bin:${PATH}" \
    APP_NAME="wsgi:app" \
    APP_SETTINGS="bank_transactie_service.config.ProductionConfig"

# Runtime envrionment
CMD ["bash", "-c", "exec gunicorn \
  --workers=${GUNICORN_WORKERS} \
  --threads=${GUNICORN_THREADS} \
  --bind=0.0.0.0:${GUNICORN_PORT} \
  --log-level=${GUNICORN_LOGLEVEL} \
  --capture-output \
  --worker-class=gthread \
  --worker-tmp-dir /dev/shm \
  ${APP_NAME}"]
