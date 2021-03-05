ARG DOCKER_PROXY=''
# Build
FROM ${DOCKER_PROXY}python:3.8-slim-buster AS build

# Timezone
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get -y update && apt-get -y install --no-install-recommends \
    tzdata \
    && rm -rf /var/lib/apt/lists/*
ENV TZ Europe/Amsterdam

# set the working directory in the container
RUN useradd --home-dir /app --create-home --shell /bin/bash app
USER app
WORKDIR /app

# install the dependencies only for fast rebuilds
COPY --chown=app:app setup.py ./
RUN mkdir -p hhb_backend/ && python3 setup.py install --user --prefix=''

# copy the content of the local src directory to the working directory
COPY --chown=app:app ./ ./
# install the package
RUN python3 setup.py install --user --prefix=''

RUN python generator.py

FROM ${DOCKER_PROXY}postgres:11-alpine

WORKDIR /data
ENV TEST=1
COPY docker/ /data/
COPY --from=build /app/data /data/

CMD ["./load.sh"]
