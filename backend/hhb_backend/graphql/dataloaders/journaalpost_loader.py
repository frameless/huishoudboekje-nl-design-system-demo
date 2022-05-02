from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader


class JournaalpostenByIdLoader(SingleDataLoader):
    """ Load journaalposten using ids """
    model = "journaalposten"
    service = settings.HHB_SERVICES_URL


class JournaalpostenByTransactionLoader(SingleDataLoader):
    """ Load journaalposten using transaction_ids """
    model = "journaalposten"
    service = settings.HHB_SERVICES_URL
    filter_item = "filter_transactions"
    index = "transaction_id"

class JournaalpostenByAfspraakLoader(SingleDataLoader):
    """ Load jounaalposten using afspraak_ids """
    model = "journaalposten"
    service = settings.HHB_SERVICES_URL
    filter_item = "filter_afspraken"
    index = "afspraak_id"
