import logging
from core_service.utils import valid_date_range
from decimal import Context, ROUND_HALF_DOWN
from decimal import Decimal
from injector import inject
from rapportage_service.repositories.banktransactieservice_repository import BanktransactieServiceRepository
from rapportage_service.repositories.huishoudboekjeservice_repository import HuishoudboekjeserviceRepository


class TransactieController():
    _hhb_repository: HuishoudboekjeserviceRepository
    _banktransactionservice_repository: BanktransactieServiceRepository

    @inject
    def __init__(self, hhb_repository: HuishoudboekjeserviceRepository, banktransactionservice_repository: BanktransactieServiceRepository) -> None:
        self._hhb_repository = hhb_repository
        self._banktransactionservice_repository = banktransactionservice_repository

    def get_transacties_in_range_and_afspraak(self, agreement_ids, start, end):
        agreement_with_transactions = self._hhb_repository.get_transactions_for_agreement_with_journalentry(
            agreement_ids)

        transaction_ids = []
        journalentryLookup = {}

        for agreement in agreement_with_transactions:
            agreement_uuid, transactions = agreement
            if transactions is not None:
                transaction_ids.extend(transactions.keys())
                journalentryLookup.update(transactions)

        transactions_info = self._banktransactionservice_repository.get_transacties_in_range(
            start, end, transaction_ids)

        transactie_id_to_transactie_dict = {
            transaction["uuid"]: transaction for transaction in transactions_info}

        resulting_values = []

        for agreement in agreement_with_transactions:
            agreement_uuid, transactions = agreement
            entry = {"uuid": agreement_uuid, "transactions": []}
            if transactions is not None:
                for transaction_id, journalentry_uuid in transactions.items():
                    transaction = transactie_id_to_transactie_dict.get(
                        transaction_id, None)
                    if transaction is not None:
                        transaction["journalentry_uuid"] = journalentry_uuid
                        entry["transactions"].append(transaction)

            resulting_values.append(entry)

        return {"data": resulting_values}, 200
