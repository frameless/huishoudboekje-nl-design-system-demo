from flask.views import MethodView
from flask import request
from hhb_models.gebruiker import Gebruiker
from hhb_models.burger import Burger
from gebruikers_service.database import db

class BurgerView(MethodView):

    def get(self):
        """ List all known burgers """
        burgers = Burger.query.all()
        return {"data": [b.to_dict() for b in burgers]} 

    def post(self):
        """ Add a new Burger """
        if not request.json:
            return "Missing user data", 400
        burger = Burger()
        burger.burgerservicenummer = request.json["burgerservicenummer"]
        burger.voornamen = request.json["voornamen"]
        burger.voorletters = request.json["voorletters"]
        burger.voorvoegsel = request.json["voorvoegsel"]
        burger.geslachtsnaam = request.json["geslachtsnaam"]
        burger.straatnaam = request.json["straatnaam"]
        burger.huisnummer = request.json["huisnummer"]
        burger.huisletter = request.json["huisletter"]
        burger.huistoevoeging = request.json["huisnummertoevoeging"]
        burger.postcode = request.json["postcode"]
        burger.woonplaatsnaam = request.json["woonplaatsnaam"]
        db.session.add(burger)
        db.session.commit()
        return {"data": burger.to_dict()}, 201