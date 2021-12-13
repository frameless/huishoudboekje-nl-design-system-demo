# Welcome to the signalenservice 👋

A little Node.js REST API that is a REST service to store signals (alarms that have gone off) in.

# Setup

Just clone this repo and run it using `npm start`. You can also choose to Dockerify this app. An example Dockerfile is included in this repository.

### Environment variables

Example `.env` for GitLab:

```dotenv
DATABASE_URL="{your_postgres_connection_string}"
```

# Usage

Once the service is running, a REST API will be available on `http://localhost:8080`.

### Example HTTP request

Below is an example of how to create a new entry. More examples [here](./example_requests.http).

```http request
POST http://localhost:8080/v1/signals
Accept: application/json
Content-Type: application/json

{
  "alarmId": "a1c2e3-a724ef-a2c90f-ab00ea",
  "isActive": true,
  "type": "default",
  "context": {
	"something": "else",
	"is": true
  }
}
```


