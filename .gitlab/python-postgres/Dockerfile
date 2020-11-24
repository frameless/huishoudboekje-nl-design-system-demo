ARG DOCKER_PROXY=''

FROM ${DOCKER_PROXY}python:3.8-slim-buster
ENTRYPOINT /bin/bash

ENV APP_HOME=/app
RUN useradd --home-dir $APP_HOME --create-home --shell /bin/bash app

RUN apt-get update && \
    apt-get install --no-install-recommends --yes postgresql make && \
    rm -rf /var/lib/apt/lists/*

USER app
ENV PATH="$APP_HOME/.local/bin:$PATH"
