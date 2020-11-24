""" Factories to generate objects within a test scope """
import pytest
from datetime import date
from models.afspraak import Afspraak

class AfspraakFactory():
    """ Factory for Afspraak objects """

    def __init__(self, session, gebruiker_factory):
        self.gebruikers_factory = gebruiker_factory
        self.dbsession = session

    def createAfspraak(
        self,
        gebruiker = None,
        beschrijving: str = "Nieuwe afspraak",
        start_datum: date = date(2020, 10, 1),
        eind_datum: date = date(2020, 10, 1),
        aantal_betalingen: int = 5,
        interval: str = "P1Y2M10DT2H30M",
        #tegen_rekening=None,
        bedrag: float = 13.37,
        credit: bool = True,
        kenmerk: str = "ABC1234",
        actief: bool = True,
        organisatie_id: int = None,
        rubriek_id: int = None
    ):
        if not gebruiker:
            gebruiker = self.gebruikers_factory.createGebruiker()
            self.dbsession.add(gebruiker)
            self.dbsession.flush()
        afspraak = Afspraak(
            gebruiker=gebruiker,
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
        )
        if organisatie_id:
            afspraak.organisatie_id = organisatie_id
            
        self.dbsession.add(afspraak)
        self.dbsession.flush()
        return afspraak

@pytest.fixture(scope="function")
def afspraak_factory(session, request, gebruiker_factory):
    """
    creates an instance of the AfspraakFactory with function scope dbsession
    """
    return AfspraakFactory(session, gebruiker_factory)