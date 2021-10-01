from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader, ListDataLoader


class RekeningenByIdLoader(SingleDataLoader):
    """ Load rekeningen using ids """
    model = "rekeningen"


class RekeningenByBurgerLoader(ListDataLoader):
    """ Load rekeningen list for burger ids """
    model = "rekeningen"
    filter_item = "filter_burgers"
    index = "burgers"
    is_list = True


class RekeningenByAfdelingLoader(ListDataLoader):
    """ Load rekeningen list for afdelingen ids """
    model = "rekeningen"
    filter_item = "filter_afdelingen"
    index = "afdelingen"
    is_list = True


class RekeningenByIbanLoader(SingleDataLoader):
    """ Load rekeningen list for ibans """
    model = "rekeningen"
    filter_item = "filter_ibans"
    index = "iban"
