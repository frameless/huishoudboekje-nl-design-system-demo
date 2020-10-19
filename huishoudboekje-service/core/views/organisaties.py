""" MethodView for /gebruiker/<gebruiker_id>/burger/ path """
from flask.views import MethodView
from flask import request
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import IntegrityError
from models.organisatie import Organisatie
from core.database import db

organisatie_schema = {
    "type": "object",
    "properties": {
        "kvk_nummer": {
            "type": "integer",
        },
        "weergave_naam": {
            "type": "string",
        },
    },
    "required": []
}

class OrganisatieInputs(Inputs):
    """ JSON validator for creating a new Burger """
    json = [JsonSchema(schema=organisatie_schema)]

class OrganisatieView(MethodView):
    """ Methods for /organisaties/ path """

    def get(self, organisatie_id=None):
        """ Return a list of all Organisaties """
        if organisatie_id:
            # /organisaties/<organisatie_id>/
            try:
                organisatie = Organisatie.query.filter(Organisatie.id==organisatie_id).one()
            except NoResultFound:
                return {"errors": ["Organisatie not found."]}, 404
            return {"data": organisatie.to_dict()}, 200

        # /organisaties/
        filter_ids = request.args.get('filter_ids')
        filter_kvks = request.args.get('filter_kvks')
        organisaties = Organisatie.query
        if filter_ids:
            try:
                organisaties = organisaties.filter(
                    Organisatie.id.in_([int(id) for id in filter_ids.split(",")])
                )
            except ValueError:
                return {"errors": ["Input for filter_ids is not correct"]}, 400
        if filter_kvks:
            try:
                organisaties = organisaties.filter(
                    # cast all kvk_numbers to ints and then add leading 0's
                    Organisatie.kvk_nummer.in_([str(int(kvkn)).zfill(8) for kvkn in filter_kvks.split(",")])
                )
            except ValueError:
                return {"errors": ["Input for filter_kvks is not correct"]}, 400
        return {"data": [o.to_dict() for o in organisaties.all()]}


    def post(self, organisatie_id=None):
        """ Create or update an Organisatie """
        inputs = OrganisatieInputs(request)
        if not inputs.validate():
            return {"errors": inputs.errors}, 400

        if organisatie_id:
            try:
                organisatie = Organisatie.query.filter(Organisatie.id==organisatie_id).one()
            except NoResultFound:
                return {"errors": ["Organisatie not found."]}, 404
            response_code = 202
        else:
            organisatie = Organisatie()
            db.session.add(organisatie)
            response_code = 201

        for key, value in request.json.items():
            setattr(organisatie, key, value)
        try:
            db.session.commit()
        except IntegrityError:
            return {"errors":["kvk_number already excists"]}, 409
        return {"data": organisatie.to_dict()}, response_code

    def delete(self, organisatie_id=None):
        """ Delete an Organisatie """
        if not organisatie_id:
            return {"errors": ["Delete method requires an organisatie_id"]}, 400
        try:
            organisatie = Organisatie.query.filter(Organisatie.id==organisatie_id).one()
        except NoResultFound:
            return {"errors": ["Organisatie not found."]}, 404
        db.session.delete(organisatie)
        db.session.commit()
        return {}, 202
