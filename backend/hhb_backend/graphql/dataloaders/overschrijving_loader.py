from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL


class OverschrijvingLoader(DataLoader):
    service = HHB_SERVICES_URL
    model = "overschrijvingen"

    def by_afspraak(self, afspraak_id: int) -> List[dict]:
        return self.load(afspraak_id, filter_item="filter_afspraken")

    def by_afspraken(self, afspraak_id: List[int]) -> List[dict]:
        return self.load(afspraak_id, filter_item="filter_afspraken")
