ARG DOCKER_PROXY=''

# Create version.json
FROM ${DOCKER_PROXY}alpine:latest AS version

RUN apk add --update jq

ARG COMPONENT_NAME=huishoudboekje_service
ARG COMPONENT_TAG=undefined
ARG COMPONENT_COMMIT_HASH=undefined
RUN jq -ncM '{tag: env.COMPONENT_TAG, commit: env.COMPONENT_COMMIT_HASH, component: env.COMPONENT_NAME}' | tee /version.json

#Build
FROM ${DOCKER_PROXY}python:3.8-slim-buster

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

COPY --from=version --chown=app:app /version.json /app/huishoudboekje_service/version.json

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
  --workers=${GUNICORN_WORKERS} \
  --threads=${GUNICORN_THREADS} \
  --bind=0.0.0.0:${GUNICORN_PORT} \
  --log-level=${GUNICORN_LOGLEVEL} \
  --capture-output \
  --worker-class=gthread \
  --worker-tmp-dir /dev/shm \
  ${APP_NAME}"]
