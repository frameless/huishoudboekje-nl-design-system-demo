from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader

class RubriekByIdLoader(SingleDataLoader):
    """ Load rekeningen using ids """
    model = "rubrieken"
