from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader

class GebruikersByIdLoader(SingleDataLoader):
    """ Load gebruikers using ids """
    model = "gebruikers"
