FROM node:20
RUN apt-get update
RUN apt-get install --yes openssl
WORKDIR /app
COPY ./package*.json /app/
COPY . /app
ENV NODE_ENV="dev"
EXPOSE 8080
CMD ["/bin/sh", "start.sh"]