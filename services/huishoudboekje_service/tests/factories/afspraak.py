""" Factories to generate objects within a test scope """

from datetime import date

import pytest
from sqlalchemy.sql.sqltypes import String

from models.afspraak import Afspraak

class AfspraakFactory():
    """ Factory for Afspraak objects """

    def __init__(self, session, burger_factory):
        self.burgers_factory = burger_factory
        self.dbsession = session

    def createAfspraak(
        self,
        burger = None,
        omschrijving: str = "Nieuwe afspraak",
        valid_from: date = date(2020, 10, 1),
        valid_through: date = date(2020, 10, 1),
        aantal_betalingen: int = 5,
        betaalinstructie: str = '''{
            byDay: [1,2]
            byMonth: [3,4]
            byMonthDay: []
            byMonthWeek: []
            exceptDates: []
            startDatum: 2021-01-01
            eindDatum: 2021-12-31

        }''',
        tegen_rekening=None,
        bedrag: float = 13.37,
        credit: bool = True,
        zoektermen = ["ABC1234"],
        afdeling_id: int = None,
        postadres_id: String = None,
        alarm_id: String = None,
        rubriek_id: int = None
    ):
        if not burger:
            burger = self.burgers_factory.createBurger()
            self.dbsession.add(burger)
            self.dbsession.flush()
        afspraak = Afspraak(
            burger=burger,
            omschrijving=omschrijving,
            valid_from=valid_from,
            valid_through=valid_through,
            aantal_betalingen=aantal_betalingen,
            betaalinstructie=betaalinstructie,
            bedrag=bedrag,
            credit=credit,
            zoektermen=zoektermen,
            rubriek_id=rubriek_id,
            tegen_rekening=tegen_rekening
        )
        if afdeling_id:
            afspraak.afdeling_id = afdeling_id
        if postadres_id:
            afspraak.postadres_id = postadres_id
        if alarm_id:
            afspraak.alarm_id = alarm_id
            
        self.dbsession.add(afspraak)
        self.dbsession.flush()
        return afspraak

@pytest.fixture(scope="function")
def afspraak_factory(session, request, burger_factory):
    """
    creates an instance of the AfspraakFactory with function scope dbsession
    """
    return AfspraakFactory(session, burger_factory)
