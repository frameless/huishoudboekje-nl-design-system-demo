FROM python:3.8-slim-buster

# install the dependencies only for fast rebuilds
COPY ./services/log_service /app
COPY ./services/core_service/core_service /app/core_service
# VOLUME /app
# VOLUME /app/core_service
WORKDIR /app

RUN pip install -e .

ENV FLASK_APP="log_service.app"
ENV FLASK_RUN_PORT="8000"
ENV FLASK_ENV="development"
ENV HHB_SECRET="local-secret"
ENV LOG_DATABASE_URL="postgresql://hhb:hhb@host.docker.internal/logservice"
ENV APP_SETTINGS="log_service.config.DevelopmentConfig"

RUN python manage.py db upgrade

EXPOSE 8000

CMD ["flask", "run", "--host=0.0.0.0"]