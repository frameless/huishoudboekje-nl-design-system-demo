import json
import logging
import uuid
from graphql import GraphQLError
from hhb_backend.graphql.dataloaders.msq_loaders.settings import RABBBITMQ_PASS, RABBBITMQ_USER, RABBBITMQ_HOST, RABBBITMQ_PORT
import pika

class RpcClient(object):

    def __init__(self, routing_key):
        self.routing_key = routing_key

        try:
            credentials = pika.PlainCredentials(RABBBITMQ_USER, RABBBITMQ_PASS)
            self.connection = pika.BlockingConnection(pika.ConnectionParameters(
                RABBBITMQ_HOST, RABBBITMQ_PORT, '/', credentials))
        except Exception:
            logging.exception(
                "Failed to connect to RabbitMQ service. Notification wont be sent.")
            raise GraphQLError("Error connecting to Notificator")

        self.channel = self.connection.channel()

        args = {
            'x-expires': 60000  # Time in milliseconds
        }
        self.callback_queue = f'backend-transactions-response-{str(uuid.uuid4())}'
        self.channel.queue_declare(queue=self.callback_queue, arguments=args)

        self.channel.basic_consume(
            queue=self.callback_queue,
            on_message_callback=self.on_response,
            auto_ack=True)

        self.response = None
        self.corr_id = None

    def on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    def call(self, message):
        self.response = None
        self.corr_id = str(uuid.uuid4())

        self.channel.basic_publish(
            exchange='',
            routing_key=self.routing_key,
            properties=pika.BasicProperties(
                expiration=str(30000),
                delivery_mode=2,
                headers= {
                    'PY-Callback-Queue': self.callback_queue,
                    'PY-Correlation-Id': self.corr_id,
                }
            ),
            body=str(json.dumps(message)))
        self.connection.process_data_events(time_limit=30)
        if self.response is None:
            return None
        return json.loads(self.response.decode('utf-8'))