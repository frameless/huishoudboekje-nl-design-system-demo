from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL
from hhb_backend.service.model.journaalpost import Journaalpost


class JournaalpostLoader(DataLoader[Journaalpost]):
    service = HHB_SERVICES_URL
    model = "journaalposten"

    def by_grootboekrekening(self, grootboekrekening_id: str) -> Journaalpost:
        return self.load_one(grootboekrekening_id, filter_item="filter_grootboekrekeningen")

    def by_transaction(self, transaction_id: str) -> Journaalpost:
        return self.load_one(transaction_id, filter_item="filter_transactions")

    def by_transactions(self, transaction_ids: List[str]) -> List[Journaalpost]:
        if len(transaction_ids) > 0:
            return self.load(transaction_ids, filter_item="filter_transactions")
        else:
            return []

    def by_afspraak(self, afspraak_id: int) -> List[Journaalpost]:
        return self.load(afspraak_id, filter_item="filter_afspraken")
    
    def by_uuids(self, uuid: List[str]) -> List[Journaalpost]:
        return self.load(uuid, filter_item="filter_uuid")
