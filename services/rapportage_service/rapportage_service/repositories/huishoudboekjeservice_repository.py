import os
import requests

# TODO When more services require this repository, this should be moved to the core service


class HuishoudboekjeserviceRepository:
    HHB_SERVICES_URL = os.getenv(
        'HHB_SERVICE_URL', "http://huishoudboekjeservice:8000")

    def get_transactions_burgers(self, burger_ids, filter_rubrieken):
        json = {
            "burger_ids": burger_ids,
            "filter_rubrieken": filter_rubrieken
        }
        response = requests.get(
            f"{self.HHB_SERVICES_URL}/burgers/transacties", json=json)
        return response.json()["data"]

    def get_transaction_ids_burgers(self, burger_ids) -> list[int]:
        json = {
            "burger_ids": burger_ids
        }
        response = requests.get(
            f"{self.HHB_SERVICES_URL}/burgers/transacties/ids", json=json)
        return response.json()["data"]

    def get_afspraken_with_journaalposten_in_period(self, burger_ids, startdate, enddate):
        json = {
            "burger_ids": burger_ids,
            "startdate": startdate,
            "enddate": enddate
        }
        response = requests.get(
            f"{self.HHB_SERVICES_URL}/afspraken/overzicht", json=json)

        return response.json()["data"]
