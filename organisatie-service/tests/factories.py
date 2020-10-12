""" Factories to generate objects within a test scope """
from models.organisatie import Organisatie

class OrganisatieFactory():
    """ Factory for Organisatie objects """
    def __init__(self, session):
        self.dbsession = session

    def createOrganisatie(
        self,
        kvk_nummer: int = 12345,
        naam: str = "Test Organisatie",
        straatnaam: str = "Schoolstraat",
        huisnummer: str = "1",
        postcode: str = "1234AB",
        plaatsnaam: str = "Sloothuizen"
    ):
        organisatie = Organisatie(
            kvk_nummer=kvk_nummer,
            naam=naam,
            straatnaam=straatnaam,
            huisnummer=huisnummer,
            postcode=postcode,
            plaatsnaam=plaatsnaam
        )
        self.dbsession.add(organisatie)
        self.dbsession.flush()
        return organisatie
