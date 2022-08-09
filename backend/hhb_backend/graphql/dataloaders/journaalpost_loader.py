from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class JournaalpostByIdLoader(DataLoader):
    """ Load journaalposten using ids """
    model = "journaalposten"
    service = settings.HHB_SERVICES_URL

    def by_grootboekrekening(self, grootboekrekening_id):
        return self.load(grootboekrekening_id, filter_item="filter_grootboekrekeningen")


class JournaalpostenByTransactionLoader(DataLoader):
    """ Load journaalposten using transaction_ids """
    model = "journaalposten"
    service = settings.HHB_SERVICES_URL
    filter_item = "filter_transactions"


class JournaalpostenByAfspraakLoader(DataLoader):
    """ Load jounaalposten using afspraak_ids """
    model = "journaalposten"
    service = settings.HHB_SERVICES_URL
    filter_item = "filter_afspraken"
