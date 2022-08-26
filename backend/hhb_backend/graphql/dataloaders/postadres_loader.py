from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import POSTADRESSEN_SERVICE_URL
from hhb_backend.service.model.postadres import Postadres


class PostadresLoader(DataLoader[Postadres]):
    service = POSTADRESSEN_SERVICE_URL
    model = "addresses"
