import os
import requests

#TODO When more services require this repository, this should be moved to the core service
class HuishoudboekjeserviceRepository:
    HHB_SERVICES_URL = os.getenv('HHB_SERVICE_URL', "http://huishoudboekjeservice:8000")

    def get_transactions_burger(self,burger_id):
        response = requests.get(f"{self.HHB_SERVICES_URL}/burgers/{burger_id}/transacties")
        return response.json()["data"]