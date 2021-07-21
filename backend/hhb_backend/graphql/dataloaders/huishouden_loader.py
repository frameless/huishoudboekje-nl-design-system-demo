from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader


class HuishoudensByIdLoader(SingleDataLoader):
    """Load huishoudens using ids"""

    model = "huishoudens"
