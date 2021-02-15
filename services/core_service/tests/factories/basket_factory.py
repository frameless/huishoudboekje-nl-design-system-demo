from tests.basket_service.models.basket import Basket


class BasketFactory:
    def __init__(self, session):
        self.dbsession = session

    def create_basket(
            self,
            name: str = None
    ):
        item = Basket(
            name=name,
        )
        self.dbsession.add(item)
        self.dbsession.flush()
        return item


