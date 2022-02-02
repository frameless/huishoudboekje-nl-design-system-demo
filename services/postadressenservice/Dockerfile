ARG DOCKER_PROXY=''
FROM ${DOCKER_PROXY}bitnami/node:16
RUN groupadd --gid 1001 node \
  && useradd --uid 1001 --gid node --shell /bin/bash --create-home node
RUN chown node:node /app
WORKDIR /app
USER node
COPY ./package*.json /app/
RUN npm ci
COPY . /app
EXPOSE 8080
CMD ["npm", "run", "start"]
