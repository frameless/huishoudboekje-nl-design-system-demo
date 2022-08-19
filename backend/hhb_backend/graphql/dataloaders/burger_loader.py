from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class BurgerLoader(DataLoader):
    model = "burgers"

    def by_huishouden(self, huishouden_id: int) -> List[dict]:
        return self.load(huishouden_id, filter_item="filter_huishoudens")
