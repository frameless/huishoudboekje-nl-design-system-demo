# Builder image
FROM node:lts as builder

ENV REACT_APP_API_BASE_URL https://oops.wrong.url/

RUN mkdir -p /app
WORKDIR /app

COPY ./package*.json ./
RUN npm ci
COPY ./ /app
RUN npm run build

# Set up production environment
FROM node:lts
RUN mkdir -p /app
WORKDIR /app
COPY --from=builder /app/build /app

EXPOSE 80
CMD ["npx", "serve", "-s", ".", "-p", "80"]