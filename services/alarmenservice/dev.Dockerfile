FROM node:16
RUN apt-get update
RUN apt-get install --yes openssl
WORKDIR /app
COPY ./package*.json /app/
COPY . /app
EXPOSE 8080
CMD ["/bin/sh", "start.sh"]