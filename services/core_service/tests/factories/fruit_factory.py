from tests.basket_service.models.fruit import Fruit
from tests.factories.basket_factory import BasketFactory


class FruitFactory:
    def __init__(self, session, basket_factory: BasketFactory):
        self.dbsession = session
        self.basket_factory = basket_factory

    def create_fruit(
            self,
            id: int = None,
            basket_id: int = None,
            name: str = None,
    ):
        if not basket_id:
            basket = self.basket_factory.create_basket()
            self.dbsession.add(basket)
            self.dbsession.flush()
            basket_id = basket.id

        item = Fruit(
            id=id,
            basket_id=basket_id,
            name=name,
        )
        self.dbsession.add(item)
        self.dbsession.flush()
        return item
