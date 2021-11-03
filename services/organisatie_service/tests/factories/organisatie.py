""" Factories to generate objects within a test scope """
import pytest
from models.organisatie import Organisatie

class OrganisatieFactory():
    """ Factory for Organisatie objects """

    def __init__(self, session):
        self.dbsession = session

    def createOrganisatie(
        self,
        kvknummer: str = "12345",
        vestigingsnummer: str = "000001",
        naam: str = "Test Organisatie"
    ):
        organisatie = Organisatie(
            kvknummer=kvknummer,
            vestigingsnummer=vestigingsnummer,
            naam=naam
        )
        self.dbsession.add(organisatie)
        self.dbsession.flush()
        return organisatie

@pytest.fixture()
def organisatie_factory(dbsession, request):
    """
    creates an instance of the OrganisatieFactory with function scope dbsession
    """
    return OrganisatieFactory(dbsession)