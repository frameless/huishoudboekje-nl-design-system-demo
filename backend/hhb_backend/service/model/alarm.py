from typing import Optional, List

from hhb_backend.graphql.scalars.day_of_week import DayOfWeekEnum
from hhb_backend.service.model.base_model import BaseModel


class Alarm(BaseModel):
    id: str
    afspraakId: int
    signaalId: Optional[str]
    alarmId: int
    alarmUuid: str
    isActive: bool
    datumMargin: int
    bedrag: int
    bedragMargin: int
    byDay: List[DayOfWeekEnum]
    byMonth: List[int]
    byMonthDay: List[int]
    startDate: str
    endDate: Optional[str]

