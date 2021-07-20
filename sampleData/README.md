# Huishoudboekje sample data

This package will connect to your GraphQL API and shoot a bunch of sample data into it.

### Sample data

You will find the sample data in JSON format in `./data`. 
The objects in these files is exactly what gets loaded into the API. 

### Prerequisites

Please make sure that you have Node.js installed.

Make sure that your databases are clean. If the sample data does not work
delete all tables and run `py manage.py db upgrade` and `py manage.py db migrate` again.

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

Please make sure that you have both your frontend and backend running.
It expects the GraphQL API to be available on whatever value `GRAPHQL_API_URL` has.

To import all the sample data, just start the application:

```shell
npm start
```