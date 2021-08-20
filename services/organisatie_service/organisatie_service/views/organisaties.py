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

    def get(self, id=None):
        """ Return a list of all Organisaties """
        if id:
            # /organisaties/<id>/
            try:
                organisatie = Organisatie.query.filter(Organisatie.id==id).one()
            except NoResultFound:
                return {"errors": ["Organisatie not found."]}, 404
            return {"data": organisatie.to_dict()}, 200

        # /organisaties/
        filter_ids = request.args.get('filter_ids')
        organisaties = Organisatie.query
        if filter_ids:
            organisaties = organisaties.filter(
                Organisatie.id.in_([id for id in filter_ids.split(",")])
            )
        return {"data": [o.to_dict() for o in organisaties.all()]}

    def post(self, id=None):
        """ Create or update an Organisatie """
        inputs = OrganisatieInputs(request)
        if not inputs.validate():
            return {"errors": inputs.errors}, 400

        if id:
            try:
                organisatie = Organisatie.query.filter(Organisatie.id==id).one()
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

    def delete(self, id=None):
        """ Delete an Organisatie """
        if not id:
            return {"errors": ["Delete method requires an id"]}, 400
        try:
            organisatie = Organisatie.query.filter(Organisatie.id==id).one()
        except NoResultFound:
            return {"errors": ["Organisatie not found."]}, 404
        db.session.delete(organisatie)
        db.session.commit()
        return {}, 204
