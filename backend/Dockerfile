FROM node:lts

RUN mkdir -p /app
WORKDIR /app

COPY ./app/package*.json ./
RUN npm ci
COPY ./app /app

CMD ["npm", "run", "start"]
