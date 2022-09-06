from typing import Optional

from hhb_backend.service.model.base_model import BaseModel


class Overschrijving(BaseModel):
    id: int
    bedrag: int
    datum: str
    afspraak_id: int
    export_id: int
    bank_transaction_id: Optional[int]  # appears to be always None
