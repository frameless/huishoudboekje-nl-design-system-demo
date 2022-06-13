FROM node:18-alpine
WORKDIR /app

COPY ./ /app
RUN ls -la
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]