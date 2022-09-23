from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import SIGNALENSERVICE_URL
from hhb_backend.service.model.signaal import Signaal


class SignaalLoader(DataLoader[Signaal]):
    service = SIGNALENSERVICE_URL
    model = "signals"
    batch_size = 1000
