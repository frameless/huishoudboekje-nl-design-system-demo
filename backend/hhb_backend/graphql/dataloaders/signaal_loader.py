from typing import Dict, Union

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader

Filters = Dict[str, Union['Filters', str, int, bool]]


class SignaalByIdLoader(DataLoader):
    """ Laden van Signalen op basis van ids """
    model = "signals"
    service = settings.SIGNALENSERVICE_URL
    batch_size = 1000

