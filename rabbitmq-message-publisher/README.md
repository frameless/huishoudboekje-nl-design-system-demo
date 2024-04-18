# Rabbitmq Message Publisher
This docker image is used to publish one message on a queue in rabbitmq.

## Environment variables
it requires the following environment variables:
- HHB_RABBITMQ_HOST (default: rabbitmq)
- HHB_RABBITMQ_PORT (default: 15672)
- HHB_RABBITMQ_USER (default: guest)
- HHB_RABBITMQ_PASS (default: guest)
- EXCHANGE, name of the exchange (no default)
- ROUTING_KEY, name of the queue (no default)
- MESSAGE, the json message (no default)

## Evaluate alarms
One of the usages for this image is evaluating alarms. This needs to be triggered every night. This can be triggered by putting a message on a specific queue. This image is used to publish this message in a kubernetes cronjob. To trigger the evaluation of alarms locally the command `docker-compose run evaluate-alarms`. This will start this image with the correct variables.
