from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader

class OverschrijvingenByIdLoader(SingleDataLoader):
    """ Load overschrijvingen using ids """
    model = "overschrijvingen"
