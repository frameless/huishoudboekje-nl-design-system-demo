ARG DOCKER_PROXY=''
FROM ${DOCKER_PROXY}bitnami/node:14 as webserver
ENV HUISHOUDBOEKJESERVICE_URL="http://huishoudboekjeservice:8000"
ENV ORGANISATIESERVICE_URL="http://organisatieservice:8002"
ENV BANKTRANSACTIESERVICE_URL="http://banktransactieservice:8003"
WORKDIR /app
COPY ./package*.json /app/
RUN npm ci
COPY . /app
EXPOSE 8080
CMD ["npm", "run", "dev"]