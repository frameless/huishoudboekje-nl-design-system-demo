FROM python:3.8-slim-buster AS build

# set the working directory in the container
WORKDIR /opt/app

# copy the content of the local src directory to the working directory
COPY ./ ./     

# install the package
RUN python3 setup.py install

# Set gunicorn settings
ARG PORT=8000
ARG WORKERS=2
ARG THREADS=4

ENV PORT="${PORT}" \
    WORKERS="${WORKERS}" \
    THREADS="${THREADS}"
EXPOSE ${PORT}

# Runtime envrionment
CMD ["bash", "--login", "-c", "exec ./docker/start.sh"]
SHELL ["/bin/bash", "--login", "-c"]
