ARG DOCKER_PROXY=''
FROM ${DOCKER_PROXY}node:lts-alpine as builder
ENV CYPRESS_INSTALL_BINARY=0
WORKDIR /app
COPY ./app/package*.json ./app/version.js ./
RUN npm ci
COPY ./app .
RUN ls -la /app/.storybook
RUN npm run build-storybook

FROM bitnami/nginx:latest as webserver
COPY ./docker/nginx.default.conf /opt/bitnami/nginx/conf/server_blocks/default.conf
COPY ./docker/nginx.conf  /opt/bitnami/nginx/conf/nginx.conf
COPY --from=builder /app/storybook-static /opt/bitnami/apps/html
EXPOSE 8080