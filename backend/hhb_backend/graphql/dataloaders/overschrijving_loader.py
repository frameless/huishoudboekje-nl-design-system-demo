from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL
from hhb_backend.service.model.overschrijving import Overschrijving


class OverschrijvingLoader(DataLoader[Overschrijving]):
    service = HHB_SERVICES_URL
    model = "overschrijvingen"

    def by_afspraak(self, afspraak_id: int) -> List[Overschrijving]:
        return self.load(afspraak_id, filter_item="filter_afspraken")

    def by_afspraken(self, afspraak_ids: List[int]) -> List[Overschrijving]:
        return self.load(afspraak_ids, filter_item="filter_afspraken")
    
    
    def by_exports(self, export_ids: List[int]) -> List[Overschrijving]:
        return self.load(export_ids, filter_item="filter_exports")
