import os

HHB_SERVICES_URL = os.getenv('HHB_SERVICE_URL', "http://localhost:8001")
ORGANISATIE_SERVICES_URL = os.getenv('ORGANISATIE_SERVICE_URL', "http://localhost:8002")
TRANSACTIE_SERVICES_URL = os.getenv('TRANSACTIE_SERVICE_URL', "http://localhost:8003")
GROOTBOEK_SERVICE_URL = os.getenv('GROOTBOEK_SERVICE_URL', "http://localhost:8004")
LOG_SERVICE_URL = os.getenv('LOG_SERVICE_URL', "http://localhost:8005")
POSTADRESSEN_SERVICE_URL = os.getenv('POSTADRESSENSERVICE_URL', "http://localhost:8007") + '/v1'
ALARMENSERVICE_URL = os.getenv('ALARMENSERVICE_URL', "http://localhost:8008") + '/v1'
SIGNALENSERVICE_URL = os.getenv('SIGNALENSERVICE_URL', "http://localhost:8009") + '/v1'
UNLEASHSERVICE_URL = os.getenv('UNLEASHSERVICE_URL', "http://localhost:8010")
