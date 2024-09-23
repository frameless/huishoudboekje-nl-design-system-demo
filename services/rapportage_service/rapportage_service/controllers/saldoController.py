import logging
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

    def get_saldos(self, burger_ids, date):
        if not burger_ids:
            exclusion_data = self._hhb_repository.get_journalentries_rubrics()
            exclude = [item["transaction_id"]
                       for item in exclusion_data["data"]] if len(exclusion_data) > 0 else None
            return self.__get_saldo(date, None, exclude)

        transaction_ids = [transaction[self.TRANSACTION_ID]
                           for transaction in self._hhb_repository.get_transaction_ids_burgers(burger_ids)]
        if len(transaction_ids) == 0:
            return self.__generate_saldo_json(0)

        return self.__get_saldo(date, transaction_ids)

    def get_saldos_per_citizen(self, citizen_uuids, date):
        transactions_per_citizen = self._hhb_repository.get_transaction_ids_citizens(
            citizen_uuids)

        if len(transactions_per_citizen) == 0:
            return self.__generate_saldo_json(0)

        result = []
        for transactionInfo in transactions_per_citizen:
            if len(transactionInfo["transactions"]) > 0:
                result.append({"uuid": transactionInfo["uuid"], "saldo": self._banktransactionservice_repository.get_saldo(
                    date, transactionInfo["transactions"])})
            else:
                result.append({"uuid": transactionInfo["uuid"], "saldo": 0})
        return result

    def __get_saldo(self, date, transaction_ids=None, exclude=None):
        return self.__generate_saldo_json(self._banktransactionservice_repository.get_saldo(date, transactions=transaction_ids, exclude=exclude))

    def __generate_saldo_json(self, saldo):
        return {self.SALDO: saldo}
