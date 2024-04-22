FROM node:18-bookworm-slim AS base
WORKDIR /app
ENV DEBUG=1
ENV HHB_ALARM_SERVICE_URL="http://alarmenservice:8000"
ENV HHB_LOG_SERVICE_URL="http://logservice:8000"
ENV HHB_NOTIFICATION_SERVICE_URL="http://notificationservice:8000/graphql"
ENV HHB_BACKEND_URL="http://backend:8000/api/graphql"
EXPOSE 4000

FROM base as install-packages
WORKDIR /app
COPY ./package*.json ./
RUN npm install  --omit=dev

FROM install-packages AS load-protos
WORKDIR /app
COPY ./protos/ ./protos/
COPY ./graphql/ ./graphql/

FROM load-protos AS run-mesh-dev
WORKDIR /app
COPY .meshrc.yaml ./
COPY *.ts ./
CMD ["npm", "run","dev"]