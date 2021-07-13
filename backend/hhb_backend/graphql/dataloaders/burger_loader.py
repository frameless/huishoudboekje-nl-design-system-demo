from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader, ListDataLoader


class BurgersByIdLoader(SingleDataLoader):
    """Load burgers using ids"""

    model = "burgers"
    service = settings.HHB_SERVICES_URL


class BurgersByHuishoudenLoader(ListDataLoader):
    """Load burgers using huishouden"""

    model = "burgers"
    filter_item = "filter_huishoudens"
    index = "huishouden_id"
