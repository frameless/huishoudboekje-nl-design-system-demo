ARG DOCKER_PROXY=''

# Create version.json
FROM ${DOCKER_PROXY}alpine:latest AS version

RUN apk add --update jq

ARG COMPONENT_NAME=unleash
ARG COMPONENT_TAG=undefined
ARG COMPONENT_COMMIT_HASH=undefined
ARG COMPONENT_VERSION=undefined
RUN jq -ncM '{tag: env.COMPONENT_TAG, commit: env.COMPONENT_COMMIT_HASH, component: env.COMPONENT_NAME, version: env.COMPONENT_VERSION}' | tee /version.json

# Set up production environment using nginx
FROM ${DOCKER_PROXY}node:lts-alpine as webserver

WORKDIR /app

# Add non-privileged user
RUN adduser -D -u 1001 appuser
RUN chown -R appuser /app

USER appuser

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "start"]

EXPOSE 80