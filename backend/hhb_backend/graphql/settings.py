import os

HHB_SERVICES_URL = os.getenv('HHB_SERVICE_URL', "http://localhost:8001")
ORGANISATIE_SERVICES_URL = os.getenv('ORGANISATIE_SERVICE_URL', "http://localhost:8002")
TRANSACTIE_SERVICES_URL = os.getenv('TRANSACTIE_SERVICE_URL', "http://localhost:8003")
GROOTBOEK_SERVICE_URL = os.getenv('GROOTBOEK_SERVICE_URL', "http://localhost:8004")
LOG_SERVICE_URL = os.getenv('LOG_SERVICE_URL', "http://localhost:8012")
POSTADRESSEN_SERVICE_URL = os.getenv('POSTADRESSENSERVICE_URL', "http://localhost:8007") + '/v1'
ALARMENSERVICE_URL = os.getenv('ALARMENSERVICE_URL', "http://localhost:8008") + '/v1'
SIGNALENSERVICE_URL = os.getenv('SIGNALENSERVICE_URL', "http://localhost:8009") + '/v1'
RAPPORTAGE_SERVICE_URL = os.getenv('RAPPORTAGE_SERVICE_URL', "http://rapportageservice:8000")

#timeout for the get requests in the request library connection and read timeout
#To use no timeout set value to 0
INTERNAL_CONNECTION_TIMEOUT = None if int(os.getenv('INTERNAL_CONNECTION_TIMEOUT', "10")) == 0 else int(os.getenv('INTERNAL_CONNECTION_TIMEOUT', "10"))
INTERNAL_READ_TIMEOUT = None if int(os.getenv('INTERNAL_CONNECTION_TIMEOUT', "30")) == 0 else int(os.getenv('INTERNAL_CONNECTION_TIMEOUT', "30"))
