from typing import Optional, List

from hhb_backend.service.model.base_model import BaseModel


class Grootboekrekening(BaseModel):
    id: str
    naam: str
    referentie: str
    omschrijving: str
    credit: bool
    parent_id: Optional[int]
    # exposed relations
    children: List[str]
