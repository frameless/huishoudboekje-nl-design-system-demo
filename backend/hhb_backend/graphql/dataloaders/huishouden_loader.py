from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class HuishoudenByIdLoader(DataLoader):
    """Load huishoudens using ids"""
    model = "huishoudens"
