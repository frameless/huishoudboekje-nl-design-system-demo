ARG DOCKER_PROXY=''

FROM ${DOCKER_PROXY}bitnami/python:3.10.7

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get -y install tzdata
ENV TZ=Europe/Amsterdam

WORKDIR /app

COPY log_service/setup.py /app

COPY ./log_service /app
COPY ./core_service/core_service /app/core_service

RUN pip install .

ENV PYTHONUNBUFFERED="1" \
    PATH="/app/.local/bin:${PATH}" \
    APP_NAME="wsgi:app"

CMD ["bash", "-c", "exec gunicorn \
  -c gunicorn/config/gunicorn.conf.py \
  ${APP_NAME}"]
