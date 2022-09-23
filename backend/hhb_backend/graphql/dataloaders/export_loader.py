from datetime import date
from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL
from hhb_backend.service.model.export import Export


class ExportLoader(DataLoader[Export]):
    service = HHB_SERVICES_URL
    model = "export"

    def in_date_range(self, start_datum: str, eind_datum: str) -> List[dict]:
        return self.load_all(params={
            'start_datum': start_datum,
            'eind_datum': eind_datum
        })
