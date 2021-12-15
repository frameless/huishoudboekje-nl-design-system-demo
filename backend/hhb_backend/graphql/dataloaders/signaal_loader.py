from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader
from typing import Dict, Union

Filters = Dict[str, Union['Filters', str, int, bool]]

class SignaalByIdLoader(SingleDataLoader):
    """ Laden van Signalen op basis van ids """
    model = "signals"
    service = settings.SIGNALENSERVICE_URL
    filter_item = "filter_ids"
    index = "id"
    batch_size = 1000

