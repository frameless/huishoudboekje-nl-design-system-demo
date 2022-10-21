FROM node:18
RUN apt-get update
RUN apt-get install --yes openssl
WORKDIR /app
COPY ./package*.json /app/
COPY . /app
EXPOSE 8080
CMD ["npm", "run", "dev"]
