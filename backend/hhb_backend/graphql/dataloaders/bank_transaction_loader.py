from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import TRANSACTIE_SERVICES_URL
from hhb_backend.service.model.bank_transaction import BankTransaction


class BankTransactionLoader(DataLoader[BankTransaction]):
    service = TRANSACTIE_SERVICES_URL
    model = "banktransactions"

    def saldo_many(self, bank_transaction_ids: List[int]) -> List[BankTransaction]:
        return self.load(bank_transaction_ids, model=f"{self.model}/saldo", return_first=True)

    def by_csm(self, csm_id: int) -> List[BankTransaction]:
        return self.load(csm_id, filter_item="filter_csms")

    def by_is_geboekt(self, is_geboekt: bool) -> List[BankTransaction]:
        return self.load(is_geboekt, filter_item="filter_is_geboekt")
