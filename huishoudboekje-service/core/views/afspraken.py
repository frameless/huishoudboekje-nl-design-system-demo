""" MethodView for /afspraken/<afspraak_id>/ path """
from flask.views import MethodView
from flask import request, abort, make_response
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.exc import IntegrityError
from models.afspraak import Afspraak
from core.database import db
from core.utils import row2dict

afspraak_schema = {
    "type": "object",
    "properties": {
        "gebruiker_id": {
            "type": "integer",
        },
        "beschijving": {
            "type": "string",
        },
        "start_datum": {
            "type": "date",
        },
        "eind_datum": {
            "type": "date",
        },
        "aantal_betalingen": {
            "type": "integer",
        },
        "interval": {
            "type": "string",
        },
        "bedrag": {
            "type": "float",
        },
        "credit": {
            "type": "bool",
        },
        "kenmerk": {
            "type": "string",
        },
        "actief": {
            "type": "bool",
        },
    },
    "required": []
}

class AfspraakInputs(Inputs):
    """ JSON validator for creating and editing a Afspraak """
    json = [JsonSchema(schema=afspraak_schema)]

class AfspraakView(MethodView):
    """ Methods for /afspraken/ path """

    def get(self, afspraak_id=None):
        """ GET /afspraken/(<int:afspraak_id>?(columns=..,..,..)&(filter_ids=..,..,..))
        
        optional path parameter afspraak_id
        optional url parameters:
            columns: comma seperated list of columns to retrieve
            filter_ids: comma seperated list of afspraak ids

        returns
            200 {"data": <afspraak_json>}
            200 {"data": [<afspraak_json>, <afspraak_json>, <afspraak_json>]}
            404 {"errors": ["Afspraak not found."]}
            400 {"errors": ["Input for filter_ids is not correct, '...' is not a number."]}
            400 {"errors": ["Input for columns is not correct, '...' is not a column."]}
        """
        afspraak_query = Afspraak.query

        # Filter on columns
        columns = request.args.get('columns')
        if columns:
            column_filter = []
            for column_name in columns.split(","):
                if column_name not in Afspraak.__table__.columns.keys():
                    return {"errors": [f"Input for columns is not correct, '{column_name}' is not a column."]}, 400
                column_filter.append(Afspraak.__table__.columns[column_name])
            afspraak_query = afspraak_query.with_entities(*column_filter)

        # Filter on ids
        filter_ids = request.args.get('filter_ids')
        if filter_ids:
            ids = []
            for raw_id in filter_ids.split(","):
                try:
                    ids.append(int(raw_id))
                except ValueError:
                    return {"errors": [f"Input for filter_ids is not correct, '{raw_id}' is not a number."]}, 400
            afspraak_query = afspraak_query.filter(Afspraak.id.in_(ids))

        # Perform query and return the data
        if afspraak_id:
            afspraak = afspraak_query.filter(Afspraak.id==afspraak_id).one_or_none()
            if not afspraak:
                return {"errors": ["Afspraak not found."]}, 404
            return {"data": row2dict(afspraak)}, 200
        return {"data": [row2dict(afspraak) for afspraak in afspraak_query.all()]}, 200
        


    def post(self, afspraak_id=None):
        """ POST /afspraken/(<int:afspraak_id>)
        
        optional path parameter: afspraak_id
        data: JSON object containing afspraak data

        returns
            200 {"data": <afspraak_json>}
            400 {"errors": [<input data error message>]}
            404 {"errors": ["Afspraak not found."]}
            409 {"errors": [<database integrity error>]}
        """
        # Validate input data
        inputs = AfspraakInputs(request)
        if not inputs.validate():
            return {"errors": inputs.errors}, 400

        # Create or Update
        if afspraak_id:
            # Update an Afspraak
            afspraak = GetAfspraak(afspraak_id)
            response_code = 202
        else:
            # Create an Afspraak
            afspraak = Afspraak()
            db.session.add(afspraak)
            response_code = 201

        # Add data to object
        for key, value in request.json.items():
            setattr(afspraak, key, value)

        # Create or update the object in the database
        try:
            db.session.commit()
        except IntegrityError as error:
            return {"errors": [str(error)]}, 409
        return {"data": row2dict(afspraak)}, response_code

    def delete(self, afspraak_id=None):
        """ POST /afspraken/<int:afspraak_id>
        
        required path parameter: afspraak_id

        returns
            202 {}
            405 {"errors": ["Method not allowed"]}
            404 {"errors": ["Afspraak not found."]}
        """
        if not afspraak_id:
            return {"errors": ["Method not allowed"]}, 405
        afspraak = GetAfspraak(afspraak_id)
        db.session.delete(afspraak)
        db.session.commit()
        return {}, 202

def GetAfspraak(afspraak_id: int):
    """ Query database for a single Afspraak based on afspraak_id """
    try:
        return Afspraak.query.filter(Afspraak.id==afspraak_id).one()
    except NoResultFound:
        abort(make_response({"errors": ["Afspraak not found."]}, 404))
