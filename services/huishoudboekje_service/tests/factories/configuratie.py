""" Factories to generate objects within a test scope """
from datetime import date

import pytest

from models.configuratie import Configuratie


class ConfiguratieFactory():
    """ Factory for Configuratie objects """

    def __init__(self, session):
        self.dbsession = session

    def createConfiguratie(
            self,
            id: str = "ab_45",
            waarde: str = "GB33BUKB20201555555555",
    ):
        configuratie = Configuratie(
            id=id,
            waarde=waarde,
        )
        self.dbsession.add(configuratie)
        self.dbsession.flush()
        return configuratie


@pytest.fixture(scope="function")
def configuratie_factory(session, request):
    """
    creates an instance of the ConfiguratieFactory with function scope dbsession
    """
    return ConfiguratieFactory(session)
