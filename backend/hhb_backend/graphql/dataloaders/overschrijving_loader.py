from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class OverschrijvingLoader(DataLoader):
    model = "overschrijvingen"

    def by_afspraak(self, afspraak_id: int) -> List[dict]:
        return self.load(afspraak_id, filter_item="filter_afspraken")
