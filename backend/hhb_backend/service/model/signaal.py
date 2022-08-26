from typing import List, Optional

from hhb_backend.service.model.base_model import BaseModel


class Signaal(BaseModel):
    id: str
    alarmId: str
    banktransactieIds: List[int]
    isActive: bool
    type: str
    actions: List[str]
    context: Optional[str]
    bedragDifference: Optional[str]
    timeUpdated: str
