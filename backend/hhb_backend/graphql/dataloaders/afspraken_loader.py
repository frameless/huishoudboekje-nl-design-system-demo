from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader, ListDataLoader
from hhb_backend.graphql import settings

class AfsprakenByIdLoader(SingleDataLoader):
    """ Load afspraken using ids """
    model = "afspraken"

class AfsprakenByAfdelingLoader(ListDataLoader):
    """ Load afspraken using afdeling ids """
    model = "afspraken"
    service = settings.HHB_SERVICES_URL
    filter_item = "filter_afdelingen"
    index = "afdeling_id"

class AfsprakenByBurgerLoader(ListDataLoader):
    """ Load afspraken using burger ids """
    model = "afspraken"
    filter_item = "filter_burgers"
    index = "burger_id"


class AfsprakenByRekeningLoader(ListDataLoader):
    """ Load afspraken using rekeningen """
    model = "afspraken"
    filter_item = "filter_rekening"
    index = "tegen_rekening_id"
