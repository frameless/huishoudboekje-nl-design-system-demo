""" Factories to generate objects within a test scope """
from datetime import date

from models.gebruiker import Gebruiker


class GebruikerFactory():
    """ Factory for Gebruiker objects """

    def __init__(self, session):
        self.dbsession = session

    def createGebruiker(
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
            woonplaatsnaam: str = "Hoofddorp",
    ):
        gebruiker = Gebruiker(
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
            woonplaatsnaam=woonplaatsnaam
        )
        self.dbsession.add(gebruiker)
        self.dbsession.flush()
        return gebruiker
