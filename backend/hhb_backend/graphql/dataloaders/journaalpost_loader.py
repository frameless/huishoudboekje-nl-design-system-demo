from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader



class JournaalpostenByIdLoader(SingleDataLoader):
    """ Load journaalposten using ids """
    model = "journaalposten"
    service = settings.HHB_SERVICES_URL


# TODO add dataloader with filter on is_geboekt and use with false(mind the nulls)


class JournaalpostenByTransactionLoader(SingleDataLoader):
    """ Load rekeningen list for gebruiker ids """
    """ Load journaalposten using transaction_ids """
    model = "journaalposten"
    service = settings.HHB_SERVICES_URL
    filter_item = "filter_transactions"
    index = "transaction_id"

