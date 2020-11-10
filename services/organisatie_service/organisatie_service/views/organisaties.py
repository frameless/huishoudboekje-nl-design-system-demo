""" MethodView for /gebruiker/ path """
from flask.views import MethodView
from flask import request
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
from sqlalchemy.orm.exc import NoResultFound
from models.organisatie import Organisatie
from core_service.database import db

organisatie_schema = {
   "type": "object",
   "properties": {
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
   "required": []
}

class OrganisatieInputs(Inputs):
    """ JSON validator for creating a new Gebruiker """
    json = [JsonSchema(schema=organisatie_schema)]

class OrganisatieView(MethodView):
    """ Methods for /organisaties/ path """

    def get(self, kvk_nummer=None):
        """ Return a list of all Organisaties """
        if kvk_nummer:
            # /organisaties/<kvk_nummer>/
            try:
                organisatie = Organisatie.query.filter(Organisatie.kvk_nummer==kvk_nummer).one()
            except NoResultFound:
                return {"errors": ["Organisatie not found."]}, 404
            return {"data": organisatie.to_dict()}, 200

        # /organisaties/
        filter_kvks = request.args.get('filter_kvks')
        organisaties = Organisatie.query
        if filter_kvks:
            organisaties = organisaties.filter(
                Organisatie.kvk_nummer.in_([kvkn for kvkn in filter_kvks.split(",")])
            )
        return {"data": [o.to_dict() for o in organisaties.all()]}

    def post(self, kvk_nummer=None):
        """ Create or update an Organisatie """
        inputs = OrganisatieInputs(request)
        if not inputs.validate():
            return {"errors": inputs.errors}, 400

        if kvk_nummer:
            try:
                organisatie = Organisatie.query.filter(Organisatie.kvk_nummer==kvk_nummer).one()
            except NoResultFound:
                return {"errors": ["Organisatie not found."]}, 404
            response_code = 200
        else:
            organisatie = Organisatie()
            db.session.add(organisatie)
            response_code = 201

        for key, value in request.json.items():
            setattr(organisatie, key, value)
        db.session.commit()
        return {"data": organisatie.to_dict()}, response_code

    def delete(self, kvk_nummer=None):
        """ Delete an Organisatie """
        if not kvk_nummer:
            return {"errors": ["Delete method requires an kvk_nummer"]}, 400
        try:
            organisatie = Organisatie.query.filter(Organisatie.kvk_nummer==kvk_nummer).one()
        except NoResultFound:
            return {"errors": ["Organisatie not found."]}, 404
        db.session.delete(organisatie)
        db.session.commit()
        return {}, 204
