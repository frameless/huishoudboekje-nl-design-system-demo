from typing import Optional

from hhb_backend.service.model.base_model import BaseModel


class Organisatie(BaseModel):
    id: int
    naam: Optional[str]
    kvknummer: str
    vestigingsnummer: Optional[str]
