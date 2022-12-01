import graphene
import enum

class pDayOfWeek(str, enum.Enum):
    """http://schema.org/DayOfWeek implementation"""
    Monday: str = "Monday"
    Tuesday: str = "Tuesday"
    Wednesday: str = "Wednesday"
    Thursday: str = "Thursday"
    Friday: str = "Friday"
    Saturday: str = "Saturday"
    Sunday: str = "Sunday"


DayOfWeek = graphene.Enum.from_enum(pDayOfWeek)