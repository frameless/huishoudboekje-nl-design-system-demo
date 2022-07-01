FROM python:3.8

# install the dependencies only for fast rebuilds
COPY ./bank_transactie_service /app
COPY ./core_service/core_service /app/core_service

WORKDIR /app

RUN apt-get update && \
    apt-get install --no-install-recommends --yes postgresql make && \
    rm -rf /var/lib/apt/lists/*

RUN pip install -e .
RUN pip install -r test_requirements.txt

RUN useradd --home-dir /app --create-home --shell /bin/bash app
USER app

ENV FLASK_APP="bank_transactie_service.app"
ENV FLASK_RUN_PORT="8000"
ENV FLASK_ENV="development"
ENV JWT_SECRET="local-secret"
ENV TRANSACTIE_DATABASE_URL="postgresql://hhb:hhb@host.docker.internal/banktransactieservice"

EXPOSE 8000

CMD ["/bin/sh", "start.sh"]
