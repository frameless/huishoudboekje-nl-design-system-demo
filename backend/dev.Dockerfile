FROM bitnami/python:3.8

# install the dependencies only for fast rebuilds
COPY ./backend /app
# VOLUME /app
WORKDIR /app

RUN apt-get update && \
    apt-get install --no-install-recommends --yes postgresql make && \
    rm -rf /var/lib/apt/lists/*

RUN pip install -e .
RUN pip install -r test_requirements.txt

RUN useradd --home-dir /app --create-home --shell /bin/bash app
USER app

ENV FLASK_APP="hhb_backend.app"
ENV FLASK_ENV="development"
ENV FLASK_RUN_PORT="8000"
ENV HHB_SECRET=koen
ENV AUTH_AUDIENCE=None
ENV AUTH_TOKEN_SECRET=koen
ENV OIDC_CLIENT_SECRETS=/app/etc/client_secrets.json
ENV OIDC_CLOCK_SKEW="600"
ENV PREFIX="/api"
ENV HHB_SERVICE_URL="http://huishoudboekjeservice:8000"
ENV ORGANISATIE_SERVICE_URL="http://organisatieservice:8000"
ENV TRANSACTIE_SERVICE_URL="http://banktransactieservice:8000"
ENV GROOTBOEK_SERVICE_URL="http://grootboekservice:8000"
ENV LOG_SERVICE_URL="http://logservice:8000"
ENV SECRET_KEY=koen

EXPOSE 8000

CMD ["flask", "run", "--host=0.0.0.0"]