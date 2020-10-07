""" MethodView for /gebruiker/<gebruiker_id> path """
from flask.views import MethodView
from flask import request
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
from models.gebruiker import get_gebruiker
from database.database import db
from .gebruikers import gebruiker_schema

class EditGebruikerInputs(Inputs):
    """ JSON validator for updating a Gebruiker """
    json = [JsonSchema(schema=gebruiker_schema)]

class GebruikerDetailView(MethodView):
    """ Methods for /gebruiker/<gebruiker_id> path """

    def get(self, gebruiker_id: int):
        """ Get the current Gebruiker """
        return {"data": get_gebruiker(gebruiker_id).to_dict()}

    def patch(self, gebruiker_id: int):
        """ Update the current Gebruiker """
        inputs = EditGebruikerInputs(request)
        if not inputs.validate():
            return {"errors": inputs.errors}, 400

        gebruiker = get_gebruiker(gebruiker_id)
        for key, value in request.json.items():
            if value == "":
                setattr(gebruiker, key, None)
            else:
                setattr(gebruiker, key, value)
        db.session.commit()
        return {"data": gebruiker.to_dict()}, 200

    def delete(self, gebruiker_id: int):
        """ Delete the current Gebruiker """
        db.session.delete(get_gebruiker(gebruiker_id))
        db.session.commit()
        return {}, 204
