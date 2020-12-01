
class AfspraakPlanner:
    afspraak = None

    def __init__(self, afspraak):
        self.afspraak = afspraak

    def get_planned_overschrijvingen(self, start_date, end_date):
        return {}