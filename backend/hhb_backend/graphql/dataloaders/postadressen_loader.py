from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class PostadressByIdLoader(DataLoader):
    """ Load postadressen contactcatalogus using id"""
    model = "addresses"
    service = settings.POSTADRESSEN_SERVICE_URL
