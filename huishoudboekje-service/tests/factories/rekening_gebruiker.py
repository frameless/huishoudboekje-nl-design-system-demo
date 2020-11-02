""" Factories to generate objects within a test scope """
import pytest
from models.rekening_gebruiker import RekeningGebruiker

class RekeningGebruikerFactory:
    """ Factory for RekeningGebruiker objects """

    def __init__(self, session, gebruiker_factory, rekening_factory):
        self.gebruiker_factory = gebruiker_factory
        self.rekening_factory = rekening_factory
        self.dbsession = session

    def create_rekening_gebruiker(
            self,
            gebruiker = None,
            rekening = None
    ):
        if not rekening:
            rekening = self.rekening_factory.create_rekening()
        if not gebruiker:
            gebruiker = self.gebruiker_factory.createGebruiker()
        rekening_gebruiker = RekeningGebruiker(
            rekening = rekening,
            gebruiker = gebruiker
        )
        self.dbsession.add(rekening_gebruiker)
        self.dbsession.flush()
        return rekening_gebruiker


@pytest.fixture(scope="function")
def rekening_gebruiker_factory(session, request, gebruiker_factory, rekening_factory):
    """
    creates an instance of the RekeningGebruikerFactory with function scope dbsession
    """
    return RekeningGebruikerFactory(session, gebruiker_factory, rekening_factory)
