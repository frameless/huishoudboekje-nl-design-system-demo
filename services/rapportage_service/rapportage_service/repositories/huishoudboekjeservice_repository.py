import os
import requests

#TODO When more services require this repository, this should be moved to the core service
class HuishoudboekjeserviceRepository:
    HHB_SERVICES_URL = os.getenv('HHB_SERVICE_URL', "http://huishoudboekjeservice:8000")

    def get_transactions_burgers(self,burger_ids, filter_rubrieken):
        json = {
            "burger_ids": burger_ids,
            "filter_rubrieken": filter_rubrieken
        }
        response = requests.get(f"{self.HHB_SERVICES_URL}/burgers/transacties", json=json)
        return response.json()["data"]