# Welcome to the addresses service 👋

A little Node.js REST API that is a REST service to store addresses in.

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
POST http://localhost:8080/v1/addresses
Accept: application/json
Content-Type: application/json

{
    "street": "Teststraat",
    "houseNumber": "12",
    "postalCode": "9999ZZ",
    "locality": "Sloothuizen"
}
```

```json
{
  "street": "Teststraat",
  "houseNumber": "12",
  "postalCode": "9999ZZ",
  "locality": "Sloothuizen"
}
```
