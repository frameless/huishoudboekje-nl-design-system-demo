from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class BankTransactionByIdLoader(DataLoader):
    """ Load transactions using ids """
    service = settings.TRANSACTIE_SERVICES_URL
    model = "banktransactions"

    def saldo_many(self, bank_transaction_ids):
        return self.load_many(bank_transaction_ids, no_filter=True, model=f"{self.model}/saldo")


class BankTransactionByCsmLoader(DataLoader):
    """ Load transactions by customer_statement_message id """
    service = settings.TRANSACTIE_SERVICES_URL
    model = "banktransactions"
    filter_item = "filter_csms"


class BankTransactionByIsGeboektLoader(DataLoader):
    """ Load transactions by is_geboekt """
    service = settings.TRANSACTIE_SERVICES_URL
    model = "banktransactions"
    filter_item = "filter_is_geboekt"
