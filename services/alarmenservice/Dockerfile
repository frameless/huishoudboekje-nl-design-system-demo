ARG DOCKER_PROXY=''
FROM ${DOCKER_PROXY}bitnami/node:18
WORKDIR /app

COPY ./package*.json /app/
RUN npm ci
COPY . /app

# Permissions: run as non-root
RUN chmod -R a+rwx /app/node_modules/.prisma
RUN chmod -R a+rwx /app/node_modules/prisma

EXPOSE 8080
CMD ["npm", "run", "start"]
