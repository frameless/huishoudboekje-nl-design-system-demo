from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class BankTransactionByIdLoader(DataLoader):
    """ Load transactions using ids """
    model = "banktransactions"
    service = settings.TRANSACTIE_SERVICES_URL

    def saldo_many(self, bank_transaction_ids):
        # endpoint = /banktransactions/saldo/<ids>
        # todo check if load_many can add that without making recessions for other endpoints
        return self.load(','.join([str(s) for s in bank_transaction_ids]), model=f"{self.model}/saldo")


class BankTransactionByCsmLoader(DataLoader):
    """ Load transactions by customer_statement_message id """
    model = "banktransactions"
    service = settings.TRANSACTIE_SERVICES_URL
    filter_item = "filter_csms"


class BankTransactionByIsGeboektLoader(DataLoader):
    """ Load transactions by is_geboekt """
    model = "banktransactions"
    service = settings.TRANSACTIE_SERVICES_URL
    filter_item = "filter_is_geboekt"
