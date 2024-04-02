from typing import List, Optional

from hhb_backend.graphql.scalars.day_of_week import DayOfWeekEnum
from hhb_backend.service.model.base_model import BaseModel


class Betaalinstructie(BaseModel):
    by_day: Optional[List[DayOfWeekEnum]]
    by_month: Optional[List[int]]
    by_month_day: Optional[List[int]]
    repeat_frequency: Optional[str]  # unused
    except_dates: Optional[List[str]]
    start_date: Optional[str]
    end_date: Optional[str]


class Afspraak(BaseModel):
    id: int
    omschrijving: str
    bedrag: int
    credit: bool
    valid_from: str
    valid_through: Optional[str]
    rubriek_id: int
    zoektermen: Optional[List[str]]
    burger_id: int
    afdeling_id: Optional[int]
    postadres_id: Optional[str]
    alarm_id: Optional[str]
    tegen_rekening_id: int
    betaalinstructie: Optional[Betaalinstructie]
    aantal_betalingen: Optional[int]  # unused
    # exposed relations
    journaalposten: List[int]
    overschrijvingen: List[int]
