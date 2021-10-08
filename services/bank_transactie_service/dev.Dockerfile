FROM python:3.8-slim-buster

# install the dependencies only for fast rebuilds
COPY ./services/bank_transactie_service /app
COPY ./services/core_service/core_service /app/core_service
VOLUME /app
VOLUME /app/core_service
WORKDIR /app

RUN pip install -e .

ENV FLASK_APP="bank_transactie_service.app"
ENV FLASK_RUN_PORT="8000"
ENV FLASK_ENV="development"
ENV HHB_SECRET="local-secret"
ENV TRANSACTIE_DATABASE_URL="postgresql://hhb:hhb@host.docker.internal/banktransactieservice"
ENV APP_SETTINGS="bank_transactie_service.config.DevelopmentConfig"

RUN python manage.py db upgrade

EXPOSE 8000

CMD ["flask", "run", "--host=0.0.0.0"]