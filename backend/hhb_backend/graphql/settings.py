import os

HHB_SERVICES_URL = os.getenv('HHB_SERVICE_URL', "http://localhost:8000")
ORGANISATIE_SERVICES_URL = os.getenv('ORGANISATIE_SERVICE_URL', "http://localhost:8001")
TRANSACTIE_SERVICES_URL = os.getenv('TRANSACTIE_SERVICE_URL', "http://localhost:8002")
g