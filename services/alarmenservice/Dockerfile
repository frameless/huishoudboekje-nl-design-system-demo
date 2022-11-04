ARG DOCKER_PROXY=''
FROM ${DOCKER_PROXY}bitnami/node:18
WORKDIR /app

COPY ./package*.json /app/
COPY . /app
RUN npm ci

EXPOSE 8080
CMD ["npm", "run", "start"]
