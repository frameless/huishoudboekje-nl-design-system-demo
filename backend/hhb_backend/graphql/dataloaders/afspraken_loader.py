from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader, ListDataLoader

class AfsprakenByIdLoader(SingleDataLoader):
    model = "afspraken"

class AfsprakenByGebruikerLoader(ListDataLoader):
    model = "afspraken"
    filter_item = "filter_gebruikers"
    index = "gebruiker_id"
