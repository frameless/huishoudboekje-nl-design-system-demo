from typing import List

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class AlarmLoader(DataLoader):
    service = settings.ALARMENSERVICE_URL
    model = "alarms"

    def load_active(self, active: bool = True) -> List[dict]:
        return self.load(active, filter_item="is_active")
