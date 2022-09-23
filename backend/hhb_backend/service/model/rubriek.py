from typing import List, Optional

from hhb_backend.service.model.base_model import BaseModel


class Rubriek(BaseModel):
    id: int
    naam: str
    grootboekrekening_id: Optional[str]
    # exposed relations
    afspraken: List[int]  # appears to be unused
