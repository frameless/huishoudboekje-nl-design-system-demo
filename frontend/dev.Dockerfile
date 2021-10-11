FROM node:16-alpine

COPY ./frontend/app/package.json /app/app/package.json
COPY ./frontend/app/package-lock.json /app/app/package-lock.json
COPY ./frontend/app/version.js /app/app/version.js
COPY ./frontend/theme /app/theme
VOLUME /app
WORKDIR /app/app
RUN npm install
COPY ./frontend /app

EXPOSE 3000

CMD ["npm", "start"]