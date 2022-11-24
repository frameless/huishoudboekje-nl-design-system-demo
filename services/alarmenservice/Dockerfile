ARG DOCKER_PROXY=''
FROM ${DOCKER_PROXY}bitnami/node:18
WORKDIR /app

COPY ./package*.json /app/
COPY . /app
RUN npm ci
RUN npm run prisma:generate

EXPOSE 8080
CMD ["npm", "run", "start"]
