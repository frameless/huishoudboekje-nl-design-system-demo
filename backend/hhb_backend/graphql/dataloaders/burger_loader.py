from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader

class BurgersByIdLoader(SingleDataLoader):
    """ Load burgers using ids """
    model = "burgers"
