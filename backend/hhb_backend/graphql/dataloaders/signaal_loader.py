from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class SignaalLoader(DataLoader):
    service = settings.SIGNALENSERVICE_URL
    model = "signals"
    batch_size = 1000
