from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL


class BurgerLoader(DataLoader):
    service = HHB_SERVICES_URL
    model = "burgers"

    def by_huishouden(self, huishouden_id: int) -> List[dict]:
        return self.load(huishouden_id, filter_item="filter_huishoudens")
