""" MethodView for /burger/ path """

from flask.views import MethodView
from flask import request
from hhb_models.burger import Burger
from hhb_services.database import db

class BurgerView(MethodView):
    """ Methods for /burger/ path """

    def get(self):
        """ Return a list all known burgers """
        burgers = Burger.query.all()
        return {"data": [b.to_dict() for b in burgers]} 

    def post(self):
        """ Create and return a new Burger """
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
