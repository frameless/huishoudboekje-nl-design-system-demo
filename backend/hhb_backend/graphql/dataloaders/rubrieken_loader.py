from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class RubriekByIdLoader(DataLoader):
    """ Load rubriek using ids """
    model = "rubrieken"


class RubriekByGrootboekrekeningLoader(DataLoader):
    """ Load rubriek using Grootboekrekening ids """
    model = "rubrieken"
    filter_item = "filter_grootboekrekeningen"
    batch_size = 250
    return_first = True
