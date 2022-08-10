from typing import Dict, Union

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader

Filters = Dict[str, Union['Filters', str, int, bool]]


class AlarmenLoader(DataLoader):
    service = settings.ALARMENSERVICE_URL
    model = "alarms"

    def load_active(self, active: bool = True):
        return self.load(filter_item="is_active", key=active)


class AlarmByIdLoader(DataLoader):
    """ Laden van Alarmen op basis van ids """
    model = "alarms"
    service = settings.ALARMENSERVICE_URL
