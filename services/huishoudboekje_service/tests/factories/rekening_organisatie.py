""" Factories to generate objects within a test scope """
import pytest
from models.rekening_organisatie import RekeningOrganisatie

class RekeningOrganisatieFactory:
    """ Factory for RekeningGebruiker objects """

    def __init__(self, session, organisatie_factory, rekening_factory):
        self.organisatie_factory = organisatie_factory
        self.rekening_factory = rekening_factory
        self.dbsession = session

    def create_rekening_organisatie(
            self,
            organisatie = None,
            rekening = None
    ):
        if not rekening:
            rekening = self.rekening_factory.create_rekening()
        if not organisatie:
            organisatie = self.organisatie_factory.createOrganisatie()
        rekening_organisatie = RekeningOrganisatie(
            rekening = rekening,
            organisatie = organisatie
        )
        self.dbsession.add(rekening_organisatie)
        self.dbsession.flush()
        return rekening_organisatie


@pytest.fixture(scope="function")
def rekening_organisatie_factory(session, request, organisatie_factory, rekening_factory):
    """
    creates an instance of the RekeningOrganisatie with function scope dbsession
    """
    return RekeningOrganisatieFactory(session, organisatie_factory, rekening_factory)
