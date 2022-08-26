from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import ORGANISATIE_SERVICES_URL


class AfdelingLoader(DataLoader):
    service = ORGANISATIE_SERVICES_URL
    model = "afdelingen"

    def by_organisatie(self, organisatie_id: int) -> List[dict]:
        return self.load(organisatie_id, filter_item="filter_organisaties")
