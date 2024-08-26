# AlarmService.Application
This project contains the Bank service Application. The BankService is a microservice that provides functionality to store transaction files and its transactions. It also handles payment instructions.

## Usage & Configuration
The BankService can be deployed given the provided docker container on the [Huishoudboekje container registry](https://gitlab.com/commonground/huishoudboekje/app-new/container_registry/2555558)
This section provides all the necessary information to use and configure the BankService in docker or kubernetes.

### Ports:
This service uses two ports
- 8000: grpc
- 9000: prometheus metrics

### Required ENV variables
To get the BankService up and running these env variables need to be set.
- **HHB_DATABASE_URL**
- **HHB_RABBITMQ_HOST**
- **HHB_RABBITMQ_PORT**
- **HHB_RABBITMQ_USER**
- **HHB_RABBITMQ_PASS**
- **HHB_USE_AUTH**
- **HHB_JWT_ISSUER**
- **HHB_JWT_AUDIENCE**
- **HHB_JWT_SECRET**
- **HHB_JWT_ALLOWED_ALGORITHMS**
- **HHB_JWT_JWKS_URI**
- **HHB_HUISHOUDBOEKJE_SERVICE**

### Daily payment instruction creation
To automatically create payment instruction daily to be able to show missed instructions there needs to be something that triggers it. This can be triggered by putting an empty message on the queue check-payment-instructions.
See app-new\rabbitmq-message-publisher for more information. To do this in kubernetes it is recommended to use a cronjob. An example is provided.

### Metrics
A prometheus metrics endpoint is provided. Metrics are available on _hostname_:9000/metrics. No specific metrics are implemented. Default [grpc metrics](https://github.com/prometheus-net/prometheus-net/tree/master/Prometheus.AspNetCore.Grpc) from prometheus are available.

### Health checking
It is important to know if the service is still available and responding. Therefore this service has as a basic [grpc health check](https://learn.microsoft.com/en-us/aspnet/core/grpc/health-checks?view=aspnetcore-7.0) available ([This can be used by k8s](https://learn.microsoft.com/en-us/aspnet/core/grpc/health-checks?view=aspnetcore-7.0)).

### Kubernetes
Example files for deploying in kubernetes can be found in the root project /k8s

## Docker
The Dockerfile is used to build the provided docker container on [Huishoudboekje container registry](https://gitlab.com/commonground/huishoudboekje/app-new/container_registry/2555558)
To locally run the BankService for development The dev.Dockerfile can be used. It has some default ENV variables set for local development.
For production the Dockerfile should be used and all ENV variables should be set.

## Project overview
The BankService is a GRPC API, it also uses a message broker to communicate with other microservices.


### Message queue
For messaging [MassTransit](https://masstransit.io/) and [RabbitMQ](https://www.rabbitmq.com/) is used.

### Database
[Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/) is used for database communication and the database is code first.
It executes migrations on startup when in development mode.
For production the docker file contains a script `execute-migrations.sh` this script executes the migrations using ef bundle.



