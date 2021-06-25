""" Factories to generate objects within a test scope """
from datetime import date

import pytest

from models.burger import Burger


class BurgerFactory():
    """ Factory for Burger objects """

    def __init__(self, session, huishouden_factory):
        self.huishouden_factory = huishouden_factory
        self.dbsession = session

    def createBurger(
            self,
            telefoonnummer: str = "0612345678",
            email: str = "a@a.com",
            geboortedatum: date = date(2010, 10, 2),
            iban: str = "GB33BUKB20201555555555",
            voornamen: str = "Bert",
            voorletters: str = "B",
            achternaam: str = "Huismans",
            straatnaam: str = "Hoofdstraat",
            huisnummer: str = "5",
            postcode: str = "1234AB",
            plaatsnaam: str = "Hoofddorp",
            huishouden_id: int = None
    ):
        if not huishouden_id:
            huishouden = self.huishouden_factory.createHuishouden()
            self.dbsession.add(huishouden)
            self.dbsession.flush()
            huishouden_id = huishouden.id

        burger = Burger(
            telefoonnummer=telefoonnummer,
            email=email,
            geboortedatum=geboortedatum,
            iban=iban,
            voornamen=voornamen,
            voorletters=voorletters,
            achternaam=achternaam,
            straatnaam=straatnaam,
            huisnummer=huisnummer,
            postcode=postcode,
            plaatsnaam=plaatsnaam,
            huishouden_id=huishouden_id,
        )
        self.dbsession.add(burger)
        self.dbsession.flush()
        return burger


@pytest.fixture(scope="function")
def burger_factory(session, request, huishouden_factory):
    """
    creates an instance of the BurgerFactory with function scope dbsession
    """
    return BurgerFactory(session, huishouden_factory)
