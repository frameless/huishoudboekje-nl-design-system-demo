""" MethodView for /gebruiker/ path """
from flask.views import MethodView
from flask import request
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
from hhb_models.gebruiker import Gebruiker
from hhb_services.database import db

gebruiker_schema = {
   "type": "object",
   "properties": {
       "telefoonnummer": {
           "type": "string",
       },
       "email": {
           "type": "string",
       },
       "geboortedatum": {
           "type": "string",
           "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}$"
       }
   },
   "required": []
}

class NewGebruikerInputs(Inputs):
    """ JSON validator for creating a new Gebruiker """
    json = [JsonSchema(schema=gebruiker_schema)]

class GebruikerView(MethodView):
    """ Methods for /gebruiker/ path """

    def get(self):
        """ Return a list of all Gebruikers """
        gebruikers = Gebruiker.query.all()
        return {"data": [g.to_dict() for g in gebruikers]}

    def post(self):
        """ Create and return a new Gebruiker """
        inputs = NewGebruikerInputs(request)
        if not inputs.validate():
            print(inputs.errors)
            return {"errors": inputs.errors}, 400

        gebruiker = Gebruiker()
        for key, value in request.json.items():
            setattr(gebruiker, key, value)
        db.session.add(gebruiker)
        db.session.commit()
        return {"data": gebruiker.to_dict()}, 201
