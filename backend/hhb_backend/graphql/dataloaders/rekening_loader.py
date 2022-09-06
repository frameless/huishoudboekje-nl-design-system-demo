from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL
from hhb_backend.service.model.rekening import Rekening


class RekeningLoader(DataLoader[Rekening]):
    service = HHB_SERVICES_URL
    model = "rekeningen"

    def by_burger(self, burger_id: int) -> List[Rekening]:
        return self.load(burger_id, filter_item="filter_burgers")

    def by_afdeling(self, afdeling_id: int) -> List[Rekening]:
        return self.load(afdeling_id, filter_item="filter_afdelingen")

    def by_iban(self, iban: str) -> dict:
        return self.load_one(iban, filter_item="filter_ibans")

    def by_ibans(self, iban: List[str]) -> List[dict]:
        return self.load(iban, filter_item="filter_ibans")
