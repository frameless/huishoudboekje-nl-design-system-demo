from typing import List

from hhb_backend.service.model.base_model import BaseModel


class Rekening(BaseModel):
    id: int
    iban: str
    rekeninghouder: str
    # exposed relations
    afdelingen: List[int]
    afspraken: List[int]
    burgers: List[int]
