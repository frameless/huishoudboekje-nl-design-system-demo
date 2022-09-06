from typing import Optional

from hhb_backend.service.model.base_model import BaseModel


class Journaalpost(BaseModel):
    id: int
    afspraak_id: Optional[int]
    grootboekrekening_id: int
    transaction_id: int
    is_automatisch_geboekt: bool
