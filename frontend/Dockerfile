ARG DOCKER_PROXY=''

# Builder image
FROM ${DOCKER_PROXY}node:lts-alpine as builder

ENV CYPRESS_INSTALL_BINARY=0

WORKDIR /app

COPY ./app/package*.json ./app/version.js ./
RUN npm ci --unsafe-perm --legacy-peer-deps

COPY ./app /app
VOLUME /app/public/theme
RUN npm run build

# Set up production environment using nginx
FROM ${DOCKER_PROXY}bitnami/nginx:latest as webserver

EXPOSE 8080

# Copy nginx configuration
COPY ./docker/nginx.default.conf /opt/bitnami/nginx/conf/server_blocks/default.conf
COPY ./docker/nginx.conf  /opt/bitnami/nginx/conf/nginx.conf
COPY --from=builder /app/build /opt/bitnami/apps/html