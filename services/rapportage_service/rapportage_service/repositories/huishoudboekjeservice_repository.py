import os
import requests

#TODO When more services require this repository, this should be moved to the core service
class HuishoudboekjeserviceRepository:
    #TODO env meegeven aan container of k8s url maken
    HHB_SERVICES_URL = os.getenv('HHB_SERVICE_URL', "http://huishoudboekjeservice:8000")

    def get_afspraken_burger(self,burger_id):
        response = requests.get(f"{self.HHB_SERVICES_URL}/burgers/{burger_id}/transacties")
        return response.json()["data"]
