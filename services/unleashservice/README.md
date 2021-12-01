# Welcome to the unleash service 👋

A little Node.js REST API that can provide feature flags through Unleash. Please refer to the [GitLab docs on Feature Flags](https://docs.gitlab.com/ee/operations/feature_flags.html).

# Setup

Just clone this repo and run it using `npm start`. You can also choose to Dockerify this app. An example Dockerfile is included in this repository.

### Environment variables

Example `.env` for GitLab:

```dotenv
UNLEASH_URL=https://gitlab.com/api/v4/feature_flags/unleash/{project}
UNLEASH_INSTANCEID=my-instance-id
UNLEASH_APPNAME=my-app
PORT=8080
```

# Usage

Once the service is running, a REST API will be available on `http://localhost:8080`.

### Example HTTP request

```http request
POST /api/unleash/somefeature
Accept: application/json
Content-Type: application/json

{
    "userId": "ebc71e7c-e9fd"
}
```

```json
{
  "somefeature": true
}
```

### Multiple feature flags in one request

```http request
POST /api/unleash/somefeature,anotherFeature
Accept: application/json
Content-Type: application/json

{
    "userId": "ebc71e7c-e9fd"
}
```

```json
{
  "somefeature": true,
  "anotherFeature": false
}
```