import graphene


class DayOfWeek(graphene.Enum):
    """http://schema.org/DayOfWeek implementation"""
    Monday = 'Monday'
    Tuesday = 'Tuesday'
    Wednesday = 'Wednesday'
    Thursday = 'Thursday'
    Friday = 'Friday'
    Saturday = 'Saturday'
    Sunday = 'Sunday'