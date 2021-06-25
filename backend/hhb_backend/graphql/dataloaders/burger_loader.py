from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader


class BurgersByIdLoader(SingleDataLoader):
    """Load burgers using ids"""

    model = "burgers"
    service = settings.HHB_SERVICES_URL
