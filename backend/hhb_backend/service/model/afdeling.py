from typing import List, Optional

from hhb_backend.service.model.base_model import BaseModel


class Afdeling(BaseModel):
    id: int
    naam: str
    organisatie_id: int
    postadressen_ids: Optional[List[int]]
    rekeningen_ids: Optional[List[int]]
