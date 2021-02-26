from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader, ListDataLoader


class AfsprakenByIdLoader(SingleDataLoader):
    """ Load afspraken using ids """
    model = "afspraken"


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
