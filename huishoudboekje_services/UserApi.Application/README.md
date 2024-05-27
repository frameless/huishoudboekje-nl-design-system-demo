# UserApi.Application
This project contains the UserApi Application. The UserApi is a microservice that provides a rest endpoint to collect user specific data.
The UserAPi consists of multiple modules. This is the main project that connects all the modules together and combines it into the UserApi Application.

## Usage & Configuration
The UserApi can be deployed given the provided docker container on the Huishoudboekje container registry.
This section provides all the necessary information to use and configure the UserApi in docker or kubernetes.

### Ports:
This service uses two ports
- 8000: grpc
- 9000: prometheus metrics

### Required ENV variables
To get the AlarmService up and running these env variables need to be set.
- **HHB_RABBITMQ_HOST**
- **HHB_RABBITMQ_PORT**
- **HHB_RABBITMQ_USER**
- **HHB_RABBITMQ_PASS**
- **HHB_REDIS_HOST**
- **HHB_REDIS_PORT**
- **HHB_REDIS_PASS**
- **HHB_API_KEYS**
- **HHB_USE_AUTH**

### Auth
Authentication works with keys. When someone provides a key that is listed in **HHB_API_KEYS** they can access the api. **HHB_API_KEYS** is a list of keys seperated by a `;`. With the key a user can get token to access the data.
How long these tokens are valid can be controlled with the env var **HHB_TOKEN_DURATION**, it expects a number of seconds the default is 30 seconds.
Auth is enabled using **HHB_USE_AUTH**

### Metrics
A prometheus metrics endpoint is provided. Metrics are available on _hostname_:9000/metrics. No specific metrics are implemented. Default prometheus metrics are available.

### Health checking
It is important to know if the service is still available and responding. Therefore `healthz` endpoint can be used for health checking

### Kubernetes
Example files for deploying in kubernetes can be found in the root project /k8s

## Docker
The Dockerfile is used to build the provided docker container on Huishoudboekje container registry
To locally run the USerApi for development The dev.Dockerfile can be used. It has some default ENV variables set for local development.
For production the Dockerfile should be used and all ENV variables should be set.





