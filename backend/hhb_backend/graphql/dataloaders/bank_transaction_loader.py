from typing import List

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class BankTransactionLoader(DataLoader):
    service = settings.TRANSACTIE_SERVICES_URL
    model = "banktransactions"

    def saldo_many(self, bank_transaction_ids: List[int]) -> List[dict]:
        return self.load(bank_transaction_ids, model=f"{self.model}/saldo")

    def by_csm(self, csm_id: int) -> List[dict]:
        return self.load(csm_id, filter_item="filter_csms")

    def by_is_geboekt(self, is_geboekt: bool) -> List[dict]:
        return self.load(is_geboekt, filter_item="filter_is_geboekt")
