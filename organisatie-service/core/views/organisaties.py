""" MethodView for /gebruiker/ path """
from flask.views import MethodView
from flask import request
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
from models.organisatie import Organisatie
from core.database import db

organisatie_schema = {
   "type": "object",
   "properties": {
       "kvk_nummer": {
           "type": "integer",
       },
       "naam": {
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
        "plaatsnaam": {
            "type": "string",
        }
   },
   "required": ["kvk_nummer"]
}

class OrganisatieInputs(Inputs):
    """ JSON validator for creating a new Gebruiker """
    json = [JsonSchema(schema=organisatie_schema)]

class OrganisatieView(MethodView):
    """ Methods for /gebruiker/ path """

    def get(self):
        """ Return a list of all Organisaties """
        filter_ids = request.args.get('filter_ids')
        organisaties = Organisatie.query
        if filter_ids:
            try:
                organisaties = organisaties.filter(Organisatie.kvk_nummer.in_([int(id) for id in filter_ids.split(",")]))
            except ValueError:
                return {"errors": ["Input for filter_ids is not correct"]}, 400
        return {"data": [o.to_dict() for o in organisaties.all()]}

    def post(self):
        """ Create or Update function for Organisaties """
        inputs = OrganisatieInputs(request)
        if not inputs.validate():
            print(inputs.errors)
            return {"errors": inputs.errors}, 400

        organisatie = Organisatie.query.filter(Organisatie.kvk_nummer==request.json["kvk_nummer"]).one_or_none()
        if not organisatie:
            organisatie = Organisatie()
            db.session.add(organisatie)
        for key, value in request.json.items():
            setattr(organisatie, key, value)
        db.session.commit()
        return {"data": organisatie.to_dict()}, 201

    def delete(self):
        """ Delete the current Gebruiker """
        inputs = OrganisatieInputs(request)
        if not inputs.validate():
            print(inputs.errors)
            return {"errors": inputs.errors}, 400
        delete_organisatie = Organisatie.query.filter(Organisatie.kvk_nummer==request.json["kvk_nummer"]).one_or_none()
        if not delete_organisatie:
            return {"errors": ["Organisatie not found."]}, 404
        db.session.delete(delete_organisatie)
        db.session.commit()
        return {}, 204