""" Factories to generate objects within a test scope """
from models.organisatie import Organisatie

class OrganisatieFactory():
    """ Factory for Organisatie objects """
    def __init__(self, session):
        self.dbsession = session

    def createOrganisatie(
        self,
        kvk_nummer: int = 12345,
        weergave_naam: str = "Test Organisatie",
    ):
        organisatie = Organisatie(
            kvk_nummer=kvk_nummer,
            weergave_naam=weergave_naam,
        )
        self.dbsession.add(organisatie)
        self.dbsession.flush()
        return organisatie
