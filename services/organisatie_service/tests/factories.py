""" Factories to generate objects within a test scope """
from models.organisatie import Organisatie
from models.afdeling import Afdeling

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

class AfdelingFactory():
    """ Factory for Afdeling objects """
    def __init__(self, session):
        self.dbsession = session

    def createAfdeling(
        self,
        organisatie_id: int = "12345",
        postadressen_ids: list = ["test_postadres_id"],
        naam: str = "Test Organisatie"
    ):
        afdeling = Afdeling(
            organisatie_id=organisatie_id,
            postadressen_ids=postadressen_ids,
            naam=naam
        )
        self.dbsession.add(afdeling)
        self.dbsession.flush()
        return afdeling
