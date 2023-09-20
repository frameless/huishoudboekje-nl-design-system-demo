from injector import inject
from rapportage_service.repositories.banktransactieservice_repository import BanktransactieServiceRepository
from rapportage_service.repositories.huishoudboekjeservice_repository import HuishoudboekjeserviceRepository


class SaldoController():
    _hhb_repository: HuishoudboekjeserviceRepository
    _banktransactionservice_repository: BanktransactieServiceRepository

    TRANSACTION_ID = "transaction_id"
    SALDO = "saldo"


    @inject
    def __init__(self, hhb_repository: HuishoudboekjeserviceRepository, banktransactionservice_repository: BanktransactieServiceRepository) -> None:
        self._hhb_repository = hhb_repository
        self._banktransactionservice_repository = banktransactionservice_repository


    def get_saldos(self,burger_ids, date):
        if not burger_ids:
            return self.__get_saldo(date)

        transaction_ids = [transaction[self.TRANSACTION_ID] for transaction in self._hhb_repository.get_transaction_ids_burgers(burger_ids)]
        if len(transaction_ids) == 0:
            return self.__generate_saldo_json(0)
        
        return self.__get_saldo(date, transaction_ids)
        

    def __get_saldo(self, date, transaction_ids=None):
        return self.__generate_saldo_json(self._banktransactionservice_repository.get_saldo(date, transactions=transaction_ids))
    
    def __generate_saldo_json(self, saldo):
        return {self.SALDO: saldo}
    