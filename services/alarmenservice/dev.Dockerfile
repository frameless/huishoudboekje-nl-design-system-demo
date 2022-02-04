ARG DOCKER_PROXY=''
FROM ${DOCKER_PROXY}bitnami/node:16
ENV NPM_CONFIG_YES=true
WORKDIR /app
RUN npm i -g nodemon prisma
COPY ./package*.json /app/
RUN npm ci
COPY . /app
EXPOSE 8080
CMD ["/bin/sh", "start.sh"]