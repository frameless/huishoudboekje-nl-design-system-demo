ARG DOCKER_PROXY=''

# Set up production environment using nginx
FROM ${DOCKER_PROXY}node:lts-alpine as webserver

WORKDIR /app

# Add non-privileged user
RUN adduser -D -u 1001 appuser
RUN chown -R appuser /app

USER appuser

COPY ./package*.json /app/
RUN npm ci

COPY . .

CMD ["npm", "run", "start"]

EXPOSE 8080