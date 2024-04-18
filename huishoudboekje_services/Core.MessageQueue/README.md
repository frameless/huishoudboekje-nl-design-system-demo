# Core.MessageQueue
This project contains the common message queue logic that is used for all huishoudboekje services. Currently only RabbitMQ is supported

### Env variables
The environment variables used to configure the authentication are:
- **HHB_RABBITMQ_HOST** : The RabbitMQ host name
- **HHB_RABBITMQ_PORT** : The RabbitMQ host port
- **HHB_RABBITMQ_USER** : The username part of the RabbitMQ credentials the service uses
- **HHB_RABBITMQ_PASS** : The password part of the RabbitMQ credentials the service uses

## Extension
The AddMassTransitExtension is used to add the basic masstransit functionality to a new service. This makes sure that all services communicate with the message queue in the same way.
This also allows for the same configuration to be used for all services.
