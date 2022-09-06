ARG DOCKER_PROXY=''

FROM ${DOCKER_PROXY}bitnami/node:18

WORKDIR /app

COPY ./package*.json /app/
RUN npm ci

COPY . /app

CMD ["npm", "run", "start"]

EXPOSE 8080