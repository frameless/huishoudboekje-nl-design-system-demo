FROM node:lts-alpine

RUN mkdir -p /app
WORKDIR /app

COPY ./app/package*.json ./
RUN npm ci --no-progress --color=false --quiet
COPY ./app /app

EXPOSE 3000

CMD ["npm", "run", "start"]
