from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader, ListDataLoader

class BankTransactionByIdLoader(SingleDataLoader):
    """ Load rekeningen using ids """
    model = "banktransactions"
    service = settings.TRANSACTIE_SERVICES_URL

class BankTransactionByCsmLoader(ListDataLoader):
    """ Load rekeningen using ids """
    model = "banktransactions"
    service = settings.TRANSACTIE_SERVICES_URL
    filter_item = "filter_csms"
    index = "customer_statement_message_id"