import pytest

from models.huishouden import Huishouden


class HuishoudenFactory:
    """Factory for Huishouden objects"""

    def __init__(self, session):
        self.dbsession = session

    def createHuishouden(self):
        huishouden = Huishouden()
        self.dbsession.add(huishouden)
        self.dbsession.flush()

        return huishouden


@pytest.fixture(scope="function")
def huishouden_factory(session, request):
    """
    creates an instance of the HuihoudenFactory with function scope dbsession
    """
    return HuishoudenFactory(session)
