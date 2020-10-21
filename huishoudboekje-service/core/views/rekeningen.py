from flask import request
from flask.views import MethodView
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound

from core.database import db
from models.rekening import Rekening

rekening_schema = {
    "type": "object",
    "properties": {
        "iban": {
            "type": "string",
        },
        "rekeninghouder": {
            "type": "string",
        },
    },
    "required": []
}


class RekeningInputs(Inputs):
    """ JSON validator for creating a new Rekening """
    json = [JsonSchema(schema=rekening_schema)]


class RekeningView(MethodView):
    """ Methods for /rekeningen/ path """

    def get(self, rekening_id=None):
        """ Return a list of all Rekeningen """
        if rekening_id:
            # /rekeningen/<rekening_id>/
            try:
                rekening = Rekening.query.filter(Rekening.id == rekening_id).one()
            except NoResultFound:
                return {"errors": ["Rekening not found."]}, 404
            return {"data": rekening.to_dict()}, 200

        # /rekeningen/
        filter_ids = request.args.get('filter_ids')
        filter_ibans = request.args.get('filter_ibans')
        filter_rekeninghouders = request.args.get('filter_rekeninghouders')
        rekeningen = Rekening.query
        if filter_ids:
            try:
                rekeningen = rekeningen.filter(
                    Rekening.id.in_([int(id) for id in filter_ids.split(",")])
                )
            except ValueError:
                return {"errors": ["Input for filter_ids is not correct"]}, 400
        if filter_ibans:
            try:
                rekeningen = rekeningen.filter(
                    Rekening.iban.in_([ibans for ibans in filter_ibans.split(",")])
                )
            except ValueError:
                return {"errors": ["Input for filter_ibans is not correct"]}, 400
        if filter_rekeninghouders:
            try:
                rekeningen = rekeningen.filter(
                    Rekening.rekeninghouder.in_([rekhouder for rekhouder in filter_rekeninghouders.split(",")])
                )
            except ValueError:
                return {"errors": ["Input for filter_rekeninghouders is not correct"]}, 400
        return {"data": [o.to_dict() for o in rekeningen.all()]}

    def post(self, rekening_id=None):
        """ Create or update an Organisatie """
        inputs = RekeningInputs(request)
        if not inputs.validate():
            return {"errors": inputs.errors}, 400

        if rekening_id:
            try:
                rekening = Rekening.query.filter(Rekening.id == rekening_id).one()
            except NoResultFound:
                return {"errors": ["Rekening not found."]}, 404
            response_code = 202
        else:
            rekening = Rekening()
            db.session.add(rekening)
            response_code = 201

        for key, value in request.json.items():
            setattr(rekening, key, value)
        try:
            db.session.commit()
        except IntegrityError:
            return {"errors": ["iban already exists"]}, 409
        return {"data": rekening.to_dict()}, response_code

    def delete(self, rekening_id=None):
        """ Delete an Rekening """
        if not rekening_id:
            return {"errors": ["Delete method requires an rekening_id"]}, 400
        try:
            rekening = Rekening.query.filter(Rekening.id == rekening_id).one()
        except NoResultFound:
            return {"errors": ["Rekening not found."]}, 404
        db.session.delete(rekening)
        db.session.commit()
        return {}, 202
