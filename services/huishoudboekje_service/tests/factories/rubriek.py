""" Factories to generate objects within a test scope """
import pytest
from models.rubriek import Rubriek

class RubriekFactory():
    """ Factory for Afspraak objects """

    def __init__(self, session):
        self.dbsession = session

    def create_rubriek(
        self,
        naam: str = "Nieuwe rubriek",
        grootboekrekening_id: str = "Grootboek" 
    ):
        rubriek = Rubriek(
            naam = naam,
            grootboekrekening_id = grootboekrekening_id 
        )
        self.dbsession.add(rubriek)
        self.dbsession.flush()
        return rubriek

@pytest.fixture(scope="function")
def rubriek_factory(session, request):
    """
    creates an instance of the AfspraakFactory with function scope dbsession
    """
    return RubriekFactory(session)