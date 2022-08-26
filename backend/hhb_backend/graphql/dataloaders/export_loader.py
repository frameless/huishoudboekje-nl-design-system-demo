from datetime import date
from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL


class ExportLoader(DataLoader):
    service = HHB_SERVICES_URL
    model = "export"

    def in_date_range(self, start_datum: date, eind_datum: date) -> List[dict]:
        return self.load_all(params={
            'start_datum': start_datum,
            'eind_datum': eind_datum
        })
