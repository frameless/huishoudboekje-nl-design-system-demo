from typing import List

from hhb_backend.service.model.base_model import BaseModel


class Huishouden(BaseModel):
    id: int
    # exposed relations
    burgers: List[int]  # appears to be unused
