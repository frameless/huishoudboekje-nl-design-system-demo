# Builder image
FROM node:lts-alpine as builder

#ENV CI=true

WORKDIR /app

COPY ./app/package*.json ./app/version.js ./
RUN npm ci --unsafe-perm

COPY ./app /app
VOLUME /app/public/theme
RUN npm run build

# Set up production environment using nginx
FROM nginx:1.19.0-alpine as webserver

# Add non-privileged user
RUN adduser -D -u 1001 appuser

# Set ownership nginx.pid and cache folder in order to run nginx as non-root user
RUN touch /run/nginx.pid && \
    chown -R appuser /run/nginx.pid && \
    chown -R appuser /var/cache/nginx

USER appuser
EXPOSE 8080

# Copy nginx configuration
COPY ./docker/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY ./docker/nginx.conf  /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html