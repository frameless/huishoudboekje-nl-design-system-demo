import os

HHB_SERVICES_URL = os.getenv('HHB_SERVICE_URL', "http://localhost:8000")
ORGANISATIE_SERVICES_URL = os.getenv('ORGANISATIE_SERVICE_URL', "http://localhost:8001")
TRANSACTIE_SERVICES_URL = os.getenv('TRANSACTIE_SERVICE_URL', "http://localhost:8002")
GROOTBOEK_SERVICE_URL = os.getenv('GROOTBOEK_SERVICE_URL', "http://localhost:8003")
LOG_SERVICE_URL = os.getenv('LOG_SERVICE_URL', "http://localhost:8004")
CONTACTCATALOGUS_SERVICE_URL = os.getenv('CONTACTCATALOGUS_SERVICE_URL', "http://localhost:8005")
