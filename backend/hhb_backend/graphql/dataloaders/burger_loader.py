from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class BurgerByIdLoader(DataLoader):
    """Load burgers using id"""

    model = "burgers"
    service = settings.HHB_SERVICES_URL


class BurgersByHuishoudenLoader(DataLoader):
    """Load burgers using huishouden"""

    model = "burgers"
    filter_item = "filter_huishoudens"
