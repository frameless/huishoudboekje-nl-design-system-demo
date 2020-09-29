from flask.views import MethodView
from hhb_models.burger import Burger

class BurgerDetailView(MethodView):

    def get(self, burgerservicenummer):
        burger = Burger.query.filter_by(burgerservicenummer=burgerservicenummer).one()
        return {"data": burger.to_dict()}, 200

    def patch(self, burgerservicenummer):
        # TODO
        return {}
    
    def delete(self, burgerservicenummer):
        # TODO
        return {}