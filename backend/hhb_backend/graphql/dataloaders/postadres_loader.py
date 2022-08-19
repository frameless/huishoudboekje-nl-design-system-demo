from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class PostadresLoader(DataLoader):
    service = settings.POSTADRESSEN_SERVICE_URL
    model = "addresses"
