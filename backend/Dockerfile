FROM node:lts

RUN mkdir -p /app
WORKDIR /app

COPY ./app/package*.json ./
RUN npm ci
COPY ./app /app

EXPOSE 3000

CMD ["npm", "run", "start"]
