FROM node:18-bookworm-slim AS base
WORKDIR /app
ENV DEBUG=1
ENV DB_USER="postgres"
ENV DB_PASSWORD="postgres"
ENV HHB_BACKEND_URL="localhost"
ENV DB_PORT="5432"

EXPOSE 4000

FROM base as install-packages
WORKDIR /app
COPY ./package*.json ./
RUN npm install  --omit=dev

FROM install-packages AS run-mesh-dev
WORKDIR /app
COPY .meshrc.yaml ./
COPY *.ts ./
CMD ["npm", "run","dev"]