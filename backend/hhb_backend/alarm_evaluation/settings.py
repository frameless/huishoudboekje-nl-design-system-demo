import os

RABBBITMQ_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq")
RABBBITMQ_PORT = os.getenv("RABBITMQ_PORT", "5672")
RABBBITMQ_PASS = os.getenv("RABBITMQ_PASS", "guest")
RABBBITMQ_USER = os.getenv("RABBITMQ_USER", "guest")
