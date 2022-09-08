# Welcome to the alarmservice 👋

A little Node.js REST API that is a REST service to store alarm in.

# Setup

Just clone this repo and run it using `npm start`. You can also choose to Dockerify this app. An example Dockerfile is included in this repository.

### Environment variables

Example `.env` for GitLab:

```dotenv
DATABASE_URL="{your_postgres_connection_string}"
```

# Usage

Once the service is running, a REST API will be available on `http://localhost:8080`.

### Example HTTP requests

Please see [example_requests.http](./example_requests.http) for all possible requests.
