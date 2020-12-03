from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader, ListDataLoader

class RubriekByIdLoader(SingleDataLoader):
    """ Load rubriek using ids """
    model = "rubrieken"

class RubriekByGrootboekrekeningLoader(SingleDataLoader):
    """ Load rubriek using Grootboekrekening ids """
    model = "rubrieken"
    filter_item = "filter_grootboekrekeningen"
    index = "grootboekrekening_id"
    batch_size = 250
