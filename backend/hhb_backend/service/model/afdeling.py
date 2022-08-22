from typing import List

from hhb_backend.service.model.base_model import BaseModel


class Afdeling(BaseModel):
    id: int
    naam: str
    organisatie_id: int
    postadressen_ids: List[int]
    rekeningen_ids: List[int]
