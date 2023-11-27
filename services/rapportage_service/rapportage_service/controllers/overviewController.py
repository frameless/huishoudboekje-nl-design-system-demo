import logging
from core_service.utils import valid_date_range
from decimal import Context, ROUND_HALF_DOWN
from decimal import Decimal
from injector import inject
from rapportage_service.repositories.banktransactieservice_repository import BanktransactieServiceRepository
from rapportage_service.repositories.huishoudboekjeservice_repository import HuishoudboekjeserviceRepository


class OverviewController():
    _hhb_repository: HuishoudboekjeserviceRepository
    _banktransactionservice_repository: BanktransactieServiceRepository

    @inject
    def __init__(self, hhb_repository: HuishoudboekjeserviceRepository, banktransactionservice_repository: BanktransactieServiceRepository) -> None:
        self._hhb_repository = hhb_repository
        self._banktransactionservice_repository = banktransactionservice_repository

    def get_overview(self, burger_ids, start, end):
        if not valid_date_range(start, end):
            return "Invalid date range", 400

        afspraken_info = self._hhb_repository.get_afspraken_with_transactions_in_period(
            burger_ids, start, end)
        transaction_ids = []
        afspraken_info = afspraken_info[0].get('afspraken', [])

        for afspraak in afspraken_info:
            transaction_ids.extend(afspraak['transaction_ids'])

        transactions_info = self._banktransactionservice_repository.get_transacties_in_range(
            start, end, transaction_ids)
        logging.warning(transactions_info)

        for afspraak in afspraken_info:
            transactions = []
            for transaction_id in afspraak['transaction_ids']:
                found_transaction = next(
                    (transaction for transaction in transactions_info if transaction["id"] == transaction_id), None)
                if found_transaction != None:
                    transactions.append(found_transaction)
            afspraak["transactions"] = transactions

        return {"data": afspraken_info}, 200
