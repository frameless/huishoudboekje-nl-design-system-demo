from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader, ListDataLoader

class AfsprakenByIdLoader(SingleDataLoader):
    """ Load afspraken using ids """
    model = "afspraken"

class AfsprakenByGebruikerLoader(ListDataLoader):
    """ Load afspraken using gebruiker ids """
    model = "afspraken"
    filter_item = "filter_gebruikers"
    index = "gebruiker_id"
