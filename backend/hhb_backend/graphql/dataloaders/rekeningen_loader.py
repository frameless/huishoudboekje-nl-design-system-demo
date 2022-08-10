from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class RekeningByIdLoader(DataLoader):
    """ Load rekeningen using ids """
    model = "rekeningen"


class RekeningenByBurgerLoader(DataLoader):
    """ Load rekeningen list for burger ids """
    model = "rekeningen"
    filter_item = "filter_burgers"


class RekeningenByAfdelingLoader(DataLoader):
    """ Load rekeningen list for afdelingen ids """
    model = "rekeningen"
    filter_item = "filter_afdelingen"


class RekeningByIbanLoader(DataLoader):
    """ Load rekeningen list for ibans """
    model = "rekeningen"
    filter_item = "filter_ibans"
    is_single = True
