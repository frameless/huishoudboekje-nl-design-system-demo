FROM node:16
ENV CYPRESS_INSTALL_BINARY=0
WORKDIR /app
COPY ./sampleData/package*.json ./
RUN npm install
COPY ./sampleData ./
CMD ["npm", "run", "start"]