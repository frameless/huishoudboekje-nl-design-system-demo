ARG DOCKER_PROXY=''

#Build
FROM ${DOCKER_PROXY}python:3.8-slim-buster

# Timezone
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get -y install tzdata
ENV TZ Europe/Amsterdam

# set the working directory in the container
RUN useradd --home-dir /app --create-home --shell /bin/bash app
USER app
WORKDIR /app

# install the dependencies only for fast rebuilds
COPY --chown=app:app huishoudboekje_service/setup.py ./

RUN mkdir -p core_service huishoudboekje_service models && \
    python3 setup.py install --user --prefix=''

# copy the content of the local src directory to the working directory
COPY --chown=app:app ./huishoudboekje_service ./
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
    APP_SETTINGS="huishoudboekje_service.config.ProductionConfig"

# Runtime envrionment
CMD ["bash", "-c", "exec gunicorn \
  --bind=0.0.0.0:${GUNICORN_PORT} \
  --workers=${GUNICORN_WORKERS} \
  --threads=${GUNICORN_THREADS} \
  --log-level=${GUNICORN_LOGLEVEL} \
  --capture-output \
  --worker-class=gthread \
  --worker-tmp-dir /dev/shm \
  ${APP_NAME}"]
