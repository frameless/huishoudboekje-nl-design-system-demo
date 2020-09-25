FROM node:12.18.3-alpine AS build

ENV CI=true

# First copy only package.json and package-lock.json to make the dependency fetching step optional.
WORKDIR /src/website
COPY website/package.json \
    website/package-lock.json \
    ./

RUN npm ci --no-progress --color=false --quiet

# Now copy the whole workdir for the build step.
WORKDIR /src
COPY . ./

WORKDIR /src/website
RUN npm run build

# Copy static docs to alpine-based nginx container.
FROM nginx:alpine
EXPOSE 8080

# Add non-privileged user
RUN adduser -D -u 1001 appuser

# Set ownership nginx.pid and cache folder in order to run nginx as non-root user
RUN touch /var/run/nginx.pid && \
    chown -R appuser /var/run/nginx.pid && \
    chown -R appuser /var/cache/nginx

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /src/website/build /usr/share/nginx/html

USER appuser
