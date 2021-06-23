# Huishoudboekje sample data

This package will connect to your GraphQL API and shoot a bunch of sample data into it.

### Sample data

You will find the sample data in JSON format in `./data`. 
The objects in these files is exactly what gets loaded into the API. 

### Prerequisites

Please make sure that you have Node.js installed.

To install dependencies run:
```shell
npm install
```

If the backend required authorization, please make sure that you have the following environment variables set:

```shell
PROXY_AUTHORIZATION={YOUR_TOKEN}
```

### Usage

Please make sure that you have both your frontend and backend running.
By default it expects the GraphQL API to be available on `http://localhost:3000/api/graphql`.

To import all the sample data, just start the application:

```shell
npm start
```

If you want to run this during deployment or against a remote backend, it will need the following environment variables:

```shell
PROXY_AUTHORIZATION={YOUR_TOKEN}
BASE_URL=https://hhb-your-environment.nlx.reviews
```