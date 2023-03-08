FROM python:3.10.7-slim

# install the dependencies only for fast rebuilds
COPY ./rapportage_service /app
COPY ./core_service/core_service /app/core_service

WORKDIR /app

RUN apt-get update && \
    apt-get install --no-install-recommends --yes && \
    rm -rf /var/lib/apt/lists/*

RUN pip install -e .
RUN pip install -r test_requirements.txt

RUN useradd --home-dir /app --create-home --shell /bin/bash app
USER app

ENV FLASK_APP="rapportage_service.app"
ENV FLASK_RUN_PORT="8000"
ENV FLASK_DEBUG="1"
ENV JWT_SECRET="local-secret"

ENV HHB_SERVICE_URL="http://huishoudboekjeservice:8000"
ENV TRANSACTIE_SERVICE_URL="http://banktransactieservice:8000"

EXPOSE 8000

CMD ["/bin/sh", "start.sh"]
