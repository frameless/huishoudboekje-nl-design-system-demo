from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class BurgerByIdLoader(DataLoader):
    """Load burgers using id"""
    model = "burgers"


class BurgersByHuishoudenLoader(DataLoader):
    """Load burgers using huishouden"""
    model = "burgers"
    filter_item = "filter_huishoudens"
