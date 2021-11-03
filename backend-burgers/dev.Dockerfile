ARG DOCKER_PROXY=''

# Set up production environment using nginx
FROM ${DOCKER_PROXY}bitnami/node:14 as webserver

ENV HUISHOUDBOEKJESERVICE_URL="http://huishoudboekjeservice:8000"

WORKDIR /app

COPY ./package*.json /app/
RUN npm ci

COPY . /app

EXPOSE 8080

CMD ["npm", "run", "dev"]
