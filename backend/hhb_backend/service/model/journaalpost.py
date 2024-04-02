from typing import Optional

from hhb_backend.service.model.base_model import BaseModel


class Journaalpost(BaseModel):
    id: int
    uuid: str
    afspraak_id: Optional[int]
    grootboekrekening_id: int
    transaction_id: int
    is_automatisch_geboekt: bool


class JournaalpostTransactieRubriek(BaseModel):
    id: int
    transaction_id: int
    is_automatisch_geboekt: bool
    afsrpaak_rubriek_naam = Optional[str]
    grootboekrekening_rubriek_naam = Optional[str]