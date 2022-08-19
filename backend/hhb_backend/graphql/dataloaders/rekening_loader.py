from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class RekeningLoader(DataLoader):
    model = "rekeningen"

    def by_burger(self, burger_id: int) -> List[dict]:
        return self.load(burger_id, filter_item="filter_burgers")

    def by_afdeling(self, afdeling_id: int) -> List[dict]:
        return self.load(afdeling_id, filter_item="filter_afdelingen")

    def by_iban(self, iban: int) -> dict:
        return self.load_one(iban, filter_item="filter_ibans")

    def by_ibans(self, iban: List[int]) -> List[dict]:
        return self.load(iban, filter_item="filter_ibans")
