from rapportage_service.repositories.banktransactieservice_repository import BanktransactieServiceRepository
from rapportage_service.repositories.huishoudboekjeservice_repository import HuishoudboekjeserviceRepository


class RapportageController():
    def get_rapportage_burger(self,burger_id, start, end):
        burger_transactions = self.get_transactions_burger(burger_id)
        transaction_ids = [transaction["transaction_id"] for transaction in burger_transactions]
        result = self.get_transactions_in_range(start,end,transaction_ids)
        return {"data": result}, 200


    def get_transactions_burger(self, burger_id):
        hhb_repository = HuishoudboekjeserviceRepository()
        return hhb_repository.get_transactions_burger(burger_id)
    
    def get_transactions_in_range(self, start,end, transaction_ids):
        banktransaction_repository = BanktransactieServiceRepository()
        return banktransaction_repository.get_transacties_in_range(start,end,transaction_ids)
