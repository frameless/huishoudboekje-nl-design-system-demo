""" Factories to generate objects within a test scope """
import pytest

from models.rekening import Rekening


class RekeningFactory:
    """ Factory for Rekening objects """

    def __init__(self, session):
        self.dbsession = session

    def create_rekening(
            self,
            iban: str = "GB33BUKB20201555555555",
            rekeninghouder: str = "B. Huismans"
    ):
        rekening = Rekening(
            iban=iban,
            rekeninghouder=rekeninghouder
        )
        self.dbsession.add(rekening)
        self.dbsession.flush()
        return rekening


@pytest.fixture(scope="function")
def rekening_factory(session, request):
    """
    creates an instance of the AfspraakFactory with function scope dbsession
    """
    return RekeningFactory(session)
