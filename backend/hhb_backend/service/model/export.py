from typing import List

from hhb_backend.service.model.base_model import BaseModel


class Export(BaseModel):
    id: int
    naam: str
    timestamp: str
    start_datum: str
    eind_datum: str
    sha256: str
    xmldata: str
    # exposed relations
    overschrijvingen: List[int]
