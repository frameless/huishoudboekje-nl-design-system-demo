""" Factories to generate objects within a test scope """
import pytest
from datetime import date
from models.afspraak import Afspraak

class AfspraakFactory():
    """ Factory for Afspraak objects """

    def __init__(self, session, burger_factory):
        self.burgers_factory = burger_factory
        self.dbsession = session

    def createAfspraak(
        self,
        burger = None,
        beschrijving: str = "Nieuwe afspraak",
        start_datum: date = date(2020, 10, 1),
        eind_datum: date = date(2020, 10, 1),
        aantal_betalingen: int = 5,
        interval: str = "P1Y2M10DT2H30M",
        tegen_rekening=None,
        bedrag: float = 13.37,
        credit: bool = True,
        kenmerk: str = "ABC1234",
        actief: bool = True,
        organisatie_id: int = None,
        rubriek_id: int = None,
        automatisch_boeken: bool = False
    ):
        if not burger:
            burger = self.burgers_factory.createBurger()
            self.dbsession.add(burger)
            self.dbsession.flush()
        afspraak = Afspraak(
            burger=burger,
            beschrijving=beschrijving,
            start_datum=start_datum,
            eind_datum=eind_datum,
            aantal_betalingen=aantal_betalingen,
            interval=interval,
            bedrag=bedrag,
            credit=credit,
            kenmerk=kenmerk,
            actief=actief,
            rubriek_id=rubriek_id,
            automatisch_boeken=automatisch_boeken,
            tegen_rekening=tegen_rekening
        )
        if organisatie_id:
            afspraak.organisatie_id = organisatie_id
            
        self.dbsession.add(afspraak)
        self.dbsession.flush()
        return afspraak

@pytest.fixture(scope="function")
def afspraak_factory(session, request, burger_factory):
    """
    creates an instance of the AfspraakFactory with function scope dbsession
    """
    return AfspraakFactory(session, burger_factory)
