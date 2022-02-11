# Huishoudboekje sample data

This package will connect to your GraphQL API and shoot a bunch of sample data into it.

⚠️ This application is not designed to run in a production environment! We are currently just using it in our own CI and on our own local development environments as it's 
honestly too expensive to have us sitting there inputting the same data all the time when the robots can do it for us. 😄

### Sample data

You will find the sample data in JSON format in `./data`. The objects in these files is exactly what gets loaded into the API.

### Prerequisites

Please make sure that you have Node.js installed.

To install dependencies run:

```shell
npm install
```

Tell the application where your backend is running by setting the following environment variables:

```shell
GRAPHQL_API_URL=https://hhb-your-environment.nlx.reviews/api/graphql
```

If the backend required authorization, please make sure that you have the following environment variable set:

```shell
PROXY_AUTHORIZATION={YOUR_TOKEN}
```

### Usage

Please make sure that you have both your frontend and backend running. It expects the GraphQL API to be available on whatever value `GRAPHQL_API_URL` has.

To import all the sample data, just start the application:

```shell
npm start
```