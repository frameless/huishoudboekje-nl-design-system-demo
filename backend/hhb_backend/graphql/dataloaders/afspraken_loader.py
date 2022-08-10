from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class AfspraakByIdLoader(DataLoader):
    """ Load afspraken using id """
    model = "afspraken"


class AfsprakenByPostadresLoader(DataLoader):
    """ Load afspraken using postadres """
    model = "afspraken"
    filter_item = "filter_postadressen"


class AfsprakenByAfdelingLoader(DataLoader):
    """ Load afspraken using afdeling ids """
    model = "afspraken"
    filter_item = "filter_afdelingen"


class AfsprakenByBurgerLoader(DataLoader):
    """ Load afspraken using burger ids """
    model = "afspraken"
    filter_item = "filter_burgers"


class AfsprakenByRekeningLoader(DataLoader):
    """ Load afspraken using rekeningen """
    model = "afspraken"
    filter_item = "filter_rekening"
