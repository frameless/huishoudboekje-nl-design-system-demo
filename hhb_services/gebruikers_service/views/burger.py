""" MethodView for /gebruiker/<gebruiker_id>/burger/ path """

from flask.views import MethodView
from flask import request
from hhb_models.gebruiker import Gebruiker
from hhb_models.burger import Burger
from hhb_services.database import db

class BurgerView(MethodView):
    """ Methods for /gebruiker/<gebruiker_id>/burger/ path """

    def get(self, gebruiker_id):
        """ Return a burger for current gebruiker """
        gebruiker = Gebruiker.query.filter_by(id=gebruiker_id).one()
        return {"data": gebruiker.burger.to_dict()}, 200

    def post(self, gebruiker_id):
        """ Create and return a new Burger """
        if not request.json:
            return "Missing user data", 400
        burger = Burger()
        burger.gebruiker_id = gebruiker_id
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
