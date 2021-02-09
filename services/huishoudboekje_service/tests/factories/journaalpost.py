""" Factories to generate objects within a test scope """
import pytest

from models import Journaalpost


class JournaalpostFactory():
    """ Factory for Journaalpost objects """

    def __init__(self, session):
        self.dbsession = session

    def create_journaalpost(
            self,
            afspraak_id: int = None,
            transaction_id: int = 1,
            grootboekrekening_id: str = "BAbc",
            is_automatisch_geboekt: bool = False
    ):
        journaalpost = Journaalpost(
            afspraak_id=afspraak_id,
            transaction_id=transaction_id,
            grootboekrekening_id=grootboekrekening_id,
            is_automatisch_geboekt=is_automatisch_geboekt
        )
        self.dbsession.add(journaalpost)
        self.dbsession.flush()
        return journaalpost


@pytest.fixture(scope="function")
def journaalpost_factory(session, request):
    """
    creates an instance of the JournaalpostFactory with function scope dbsession
    """
    return JournaalpostFactory(session)
