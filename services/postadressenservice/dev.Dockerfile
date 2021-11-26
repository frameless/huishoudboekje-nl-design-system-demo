ARG DOCKER_PROXY=''
FROM ${DOCKER_PROXY}bitnami/node:14 as webserver
WORKDIR /app
RUN npm i -g nodemon
COPY ./package*.json /app/
RUN npm ci
COPY . /app
EXPOSE 8080

CMD ["/bin/sh", "start.sh"]