""" Factories to generate objects within a test scope """
import pytest

from models.rekening_burger import RekeningBurger


class RekeningBurgerFactory:
    """ Factory for RekeningBurger objects """

    def __init__(self, session, burger_factory, rekening_factory):
        self.burger_factory = burger_factory
        self.rekening_factory = rekening_factory
        self.dbsession = session

    def create_rekening_burger(
            self,
            burger = None,
            rekening = None
    ):
        if not rekening:
            rekening = self.rekening_factory.create_rekening()
        if not burger:
            burger = self.burger_factory.createBurger()
        rekening_burger = RekeningBurger(
            rekening = rekening,
            burger = burger
        )
        self.dbsession.add(rekening_burger)
        self.dbsession.flush()
        return rekening_burger


@pytest.fixture(scope="function")
def rekening_burger_factory(session, request, burger_factory, rekening_factory):
    """
    creates an instance of the RekeningBurgerFactory with function scope dbsession
    """
    return RekeningBurgerFactory(session, burger_factory, rekening_factory)
