import os
import requests

# TODO When more services require this repository, this should be moved to the core service


class BanktransactieServiceRepository:
    BANKTRANSACTIES_SERVICE_URL = os.getenv(
        'TRANSACTIE_SERVICE_URL', "http://banktransactieservice:8000")

    def get_transacties_in_range(self, startDate, endDate, transactions=[]):
        transactionsJson = {"transaction_ids": transactions}
        response = requests.get(
            f"{self.BANKTRANSACTIES_SERVICE_URL}/banktransactions/range?startDate={startDate}&endDate={endDate}", json=transactionsJson)
        return response.json()["data"]

    def get_saldo(self, date, transactions=None):
        transactionsJson = {"transaction_ids": transactions}
        response = requests.get(
            f"{self.BANKTRANSACTIES_SERVICE_URL}/banktransactions/sum?date={date}", json=transactionsJson)
        return response.json()["data"][0]["sum"]

    def get_transactions_by_id(self, transaction_ids=[]):
        transactionsJson = {"transaction_ids": transaction_ids}
        response = requests.get(
            f"{self.BANKTRANSACTIES_SERVICE_URL}/banktransactions/ids", json=transactionsJson)
        return response.json()["data"]
