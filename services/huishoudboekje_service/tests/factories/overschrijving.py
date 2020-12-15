""" Factories to generate objects within a test scope """
import pytest

from models import Overschrijving


class OverschrijvingFactory:
    """ Factory for Overschrijving objects """

    def __init__(self, session):
        self.dbsession = session

    def create_overschrijving(
            self,
            afspraak_id: int = 9,
            export_id: int = 5,
            datum: str = "2020-10-10",
            bedrag: int = 3498,
            bank_transaction_id: int = 2
    ):
        overschrijving = Overschrijving(
            afspraak_id=afspraak_id,
            export_id=export_id,
            datum=datum,
            bedrag=bedrag,
            bank_transaction_id=bank_transaction_id
        )
        self.dbsession.add(overschrijving)
        self.dbsession.flush()
        return overschrijving


@pytest.fixture(scope="function")
def overschrijving_factory(session, request):
    """
    creates an instance of the OverschrijvingFactory with function scope dbsession
    """
    return OverschrijvingFactory(session)
