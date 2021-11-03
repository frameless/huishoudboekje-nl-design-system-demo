""" Factories to generate objects within a test scope """
from models.afdeling import Afdeling
import pytest

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

    @pytest.fixture()
    def afdeling_factory(dbsession, request):
        """
        creates an instance of the AfdelingFactory with function scope dbsession
        """
        return AfdelingFactory(dbsession)