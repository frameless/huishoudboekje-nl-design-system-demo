from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader, ListDataLoader


class BankTransactionByIdLoader(SingleDataLoader):
    """ Load transactions using ids """
    model = "banktransactions"
    service = settings.TRANSACTIE_SERVICES_URL


class BankTransactionByCsmLoader(ListDataLoader):
    """ Load transactions by customer_statement_message id """
    model = "banktransactions"
    service = settings.TRANSACTIE_SERVICES_URL
    filter_item = "filter_csms"
    index = "customer_statement_message_id"


class BankTransactionByIsGeboektLoader(ListDataLoader):
    """ Load transactions by is_geboekt """
    model = "banktransactions"
    service = settings.TRANSACTIE_SERVICES_URL
    filter_item = "filter_is_geboekt"
    index = "is_geboekt"
    is_list = False
