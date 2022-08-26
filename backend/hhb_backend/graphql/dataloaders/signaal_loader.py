from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import SIGNALENSERVICE_URL


class SignaalLoader(DataLoader):
    service = SIGNALENSERVICE_URL
    model = "signals"
    batch_size = 1000
