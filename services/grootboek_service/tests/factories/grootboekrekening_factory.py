""" Factories to generate objects within a test scope """
import pytest
from models import Grootboekrekening

class GrootboekrekeningFactory():
    """ Factory for Grootboekrekening objects """
    def __init__(self, session):
        self.dbsession = session

    def create_grootboekrekening(
        self,
        id,
        referentie="01",
        naam="Grootboek Naam",
        omschrijving="Boekhoudkundige Naam Lang",
        parent_id=None
    ):
        grootboekrekening = Grootboekrekening(
            id=id,
            referentie=referentie,
            naam=naam,
            omschrijving=omschrijving,
            parent_id=parent_id
        )
        self.dbsession.add(grootboekrekening)
        self.dbsession.flush()
        return grootboekrekening

@pytest.fixture(scope="function")
def grootboekrekening_factory(session, request):
    """
    creates an instance of the GrootboekFactory with function scope dbsession
    """
    return GrootboekrekeningFactory(session)