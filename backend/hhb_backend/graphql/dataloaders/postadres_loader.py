from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import POSTADRESSEN_SERVICE_URL


class PostadresLoader(DataLoader):
    service = POSTADRESSEN_SERVICE_URL
    model = "addresses"
