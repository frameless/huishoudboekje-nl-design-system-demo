import json
import logging
from hhb_backend.consumers.settings import RABBBITMQ_HOST, RABBBITMQ_PASS, RABBBITMQ_PORT, RABBBITMQ_USER
import pika


class BaseConsumer():
    queue_name = None
    exchange = ''

    def __init__(self):
        if self.queue_name is None:
            raise NotImplementedError()
        
        credentials = pika.PlainCredentials(RABBBITMQ_USER, RABBBITMQ_PASS)
        connection = pika.BlockingConnection(pika.ConnectionParameters(
            RABBBITMQ_HOST, RABBBITMQ_PORT, '/', credentials))
        channel = connection.channel()
        channel.basic_qos(prefetch_count=1)
        channel.queue_declare(queue=self.queue_name, durable=True)
        channel.basic_consume(queue=self.queue_name, on_message_callback=self.callback)
        channel.start_consuming()

    def callback(self, channel, method, properties, body):
        message = json.loads(body.decode())
        self.consumer_action(message)
        channel.basic_ack(delivery_tag=method.delivery_tag)

    def consumer_action(self, message):
        ...
        logging.info(f"Cosuming message: action not implemented")