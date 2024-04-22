FROM node:18-bookworm-slim AS base
WORKDIR /app
ENV HHB_ALARM_SERVICE_URL="alarmenservice:8000"
ENV HHB_LOG_SERVICE_URL="logservice:8000"
ENV HHB_NOTIFICATION_SERVICE_URL="http://notificationservice:8000/graphql"
ENV HHB_BACKEND_URL="backend:8000/api/graphql"
EXPOSE 4000

FROM base AS install-packages
WORKDIR /app
COPY ./package*.json ./
RUN npm install  --omit=dev

FROM install-packages AS load-protos
WORKDIR /app
COPY ./protos/ ./protos/
COPY ./graphql/ ./graphql/

FROM load-protos AS build-mesh
WORKDIR /app
COPY .meshrc.yaml ./
COPY *.ts ./
RUN npm run build
RUN npm run validate

FROM build-mesh AS run-mesh
WORKDIR /app
CMD ["npm", "run","start"]