FROM python:3.8-slim-buster

# install the dependencies only for fast rebuilds
COPY ./huishoudboekje_service /app
COPY ./core_service/core_service /app/core_service

# VOLUME /app
# VOLUME /app/core_service
WORKDIR /app

RUN pip install -e .

ENV FLASK_APP="huishoudboekje_service.app"
ENV FLASK_RUN_PORT="8000"
ENV FLASK_ENV="development"
ENV HHB_SECRET="local-secret"
ENV HHB_DATABASE_URL="postgresql://hhb:hhb@host.docker.internal/huishoudboekjeservice"
ENV APP_SETTINGS="huishoudboekje_service.config.DevelopmentConfig"

EXPOSE 8000

CMD ["/bin/sh", "start.sh"]