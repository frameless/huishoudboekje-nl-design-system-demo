from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class BankTransactionByIdLoader(DataLoader):
    """ Load transactions using ids """
    model = "banktransactions"
    service = settings.TRANSACTIE_SERVICES_URL

    def saldo_many(self, bank_transaction_ids):
        # not so fancy but /banktransactions/saldo/<ids> appears to be the only endpoint of its kind
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
