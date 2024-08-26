import logging
from multiprocessing import Process
from flask import Flask
from hhb_backend.consumers.base_consumer import BaseConsumer


class RegisterConsumers():
    consumers = []

    def __init__(self, consumers: list[BaseConsumer]):
        logging.info("Initiating consumers")

        self.consumers = consumers

        self.__add_consumers()


    def __add_consumers(self):
        logging.info("Adding consumers")

        for consumer in self.consumers:
            consumer_process = Process(target = consumer, args = [])
            consumer_process.start()

            logging.info(f"Registered consumer {consumer}")
