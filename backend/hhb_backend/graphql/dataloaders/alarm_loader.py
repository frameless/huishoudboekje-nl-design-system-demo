from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader
from typing import Dict, Union

Filters = Dict[str, Union['Filters', str, int, bool]]

class AlarmByIdLoader(SingleDataLoader):
    """ Laden van Alarmen op basis van ids """
    model = "alarms"
    service = settings.ALARMENSERVICE_URL
    filter_item = "filter_ids"
    index = "id"
    batch_size = 1000

