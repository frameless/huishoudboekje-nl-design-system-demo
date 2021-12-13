ARG DOCKER_PROXY=''
FROM ${DOCKER_PROXY}bitnami/node:14
WORKDIR /app
COPY ./package*.json /app/
RUN npm ci
COPY . /app
EXPOSE 8080
CMD ["npm", "run", "start"]
