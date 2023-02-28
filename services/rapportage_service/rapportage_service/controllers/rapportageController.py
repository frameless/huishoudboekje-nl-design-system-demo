from injector import inject
from rapportage_service.repositories.banktransactieservice_repository import BanktransactieServiceRepository
from rapportage_service.repositories.huishoudboekjeservice_repository import HuishoudboekjeserviceRepository


class RapportageController():
    _hhb_repository: HuishoudboekjeserviceRepository
    _banktransactionservice_repository: BanktransactieServiceRepository

    @inject
    def __init__(self, hhb_repository: HuishoudboekjeserviceRepository, banktransactionservice_repository: BanktransactieServiceRepository) -> None:
        self._hhb_repository = hhb_repository
        self._banktransactionservice_repository = banktransactionservice_repository

    def get_rapportage_burger(self,burger_id, start, end):
        burger_transactions = self._hhb_repository.get_transactions_burger(burger_id)
        transaction_ids = [transaction["transaction_id"] for transaction in burger_transactions]
        result = self._banktransactionservice_repository.get_transacties_in_range(start,end,transaction_ids)
        return {"data": result}, 200
