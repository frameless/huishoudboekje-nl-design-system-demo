""" MethodView for /gebruiker/<gebruiker_id>/burger/ path """
from flask.views import MethodView
from flask import request
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
from models.gebruiker import get_gebruiker
from models.burger import Burger
from core.database import db

new_burger_schema = {
    "type": "object",
    "properties": {
        "voornamen": {
            "type": "string",
        },
        "voorletters": {
            "type": "string",
        },
        "achternaam": {
            "type": "string",
        },
        "straatnaam": {
            "type": "string",
        },
        "huisnummer": {
            "type": "string",
        },
        "postcode": {
            "type": "string",
        },
        "woonplaatsnaam": {
            "type": "string",
        },
    },
    "required": []
}

edit_burger_schema = new_burger_schema.copy()
edit_burger_schema["required"] = []

class NewBurgerInputs(Inputs):
    """ JSON validator for creating a new Burger """
    json = [JsonSchema(schema=new_burger_schema)]

class EditBurgerInputs(Inputs):
    """ JSON validator for updating a Burger """
    json = [JsonSchema(schema=edit_burger_schema)]

class BurgerView(MethodView):
    """ Methods for /gebruiker/<gebruiker_id>/burger/ path """

    def get(self, gebruiker_id):
        """ Return a Burger for current Gebruiker """
        gebruiker = get_gebruiker(gebruiker_id)
        if not gebruiker.burger:
            return {"errors": ["The current Gebruiker does not have a Burger"]}, 404
        return {"data": gebruiker.burger.to_dict()}, 200

    def post(self, gebruiker_id):
        """ Create and return a new Burger for the current Gebruiker """
        gebruiker = get_gebruiker(gebruiker_id)
        if not gebruiker.burger:
            burger = Burger()
            burger.gebruiker = gebruiker
            db.session.add(burger)
            db.session.flush()
        else:
            burger = gebruiker.burger

        inputs = EditBurgerInputs(request)
        if not inputs.validate():
            return {"errors": inputs.errors}, 400

        for key, value in request.json.items():
            setattr(burger, key, value)
        gebruiker.weergave_naam = f"{burger.voornamen} {burger.achternaam}"
        db.session.commit()
        return {"data": gebruiker.burger.to_dict()}, 200

    def delete(self, gebruiker_id):
        """ Delete the Burger for the current Gebruiker """
        gebruiker = get_gebruiker(gebruiker_id)
        if gebruiker.burger:
            db.session.delete(gebruiker.burger)
            db.session.commit()
        return {}, 204