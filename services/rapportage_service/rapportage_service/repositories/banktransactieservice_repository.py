import os
import requests

#TODO When more services require this repository, this should be moved to the core service
class BanktransactieServiceRepository:
    #TODO env meegeven aan container
    BANKTRANSACTIES_SERVICE_URL = os.getenv('BANKTRANSACTIES_SERVICE_URL', "http://banktransactieservice:8000")

    def get_transacties_in_range(self,startDate, endDate, transactions=[] ):
        transactionsJson = {"transaction_ids": transactions}
        response = requests.get(f"{self.BANKTRANSACTIES_SERVICE_URL}/banktransactions/range?startDate={startDate}&endDate={endDate}", json=transactionsJson)
        return response.json()["data"]