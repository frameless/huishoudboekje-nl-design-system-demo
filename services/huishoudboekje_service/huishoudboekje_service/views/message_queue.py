""" MethodView for /msq path """
import logging
from flask import request
from flask.views import MethodView
from huishoudboekje_service.settings import RABBBITMQ_HOST, RABBBITMQ_PASS, RABBBITMQ_PORT, RABBBITMQ_USER
import pika


class MessageQueueView(MethodView):
    """ Methods for /msq path """

    def post(self, **kwargs):
        """ post 

        Inputs
            queue name
            correlation id
            message json

        returns
            200
            500
        """
        queue_name = request.json.get("queue_name")
        corr_id = request.json.get("corr_id")
        message = request.json.get("message")

        logging.info("Received message to publish on msq")
        try:
            credentials = pika.PlainCredentials(RABBBITMQ_USER, RABBBITMQ_PASS)
            connection = pika.BlockingConnection(pika.ConnectionParameters(
                RABBBITMQ_HOST, RABBBITMQ_PORT, '/', credentials))
        except Exception:
            logging.exception(
                "Failed to connect to RabbitMQ service. Notification wont be sent.")
            return "Could not publish message", 500
        
        channel = connection.channel()

        channel.basic_publish(exchange='',
            routing_key=queue_name,
            properties=pika.BasicProperties(correlation_id = corr_id),
            body=message
        )

        return "Message published", 200