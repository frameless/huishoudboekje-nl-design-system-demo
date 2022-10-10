from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import ORGANISATIE_SERVICES_URL
from hhb_backend.service.model.afdeling import Afdeling


class AfdelingLoader(DataLoader[Afdeling]):
    service = ORGANISATIE_SERVICES_URL
    model = "afdelingen"

    def by_organisatie(self, organisatie_id: int) -> List[Afdeling]:
        return self.load(organisatie_id, filter_item="filter_organisaties")
