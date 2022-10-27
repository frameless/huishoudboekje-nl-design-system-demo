from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import ALARMENSERVICE_URL
from hhb_backend.service.model.alarm import Alarm


class AlarmLoader(DataLoader[Alarm]):
    service = ALARMENSERVICE_URL
    model = "alarms"

    def load_active(self, active: bool = True) -> List[Alarm]:
        return self.load("true" if active else "false", filter_item="filter_active")

