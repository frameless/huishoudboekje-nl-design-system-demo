from flask.views import MethodView
from flask import request
from flask import abort
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema
from sqlalchemy.orm.exc import NoResultFound
from hhb_models.gebruiker import Gebruiker
from hhb_services.database import db

edit_gebruiker_schema = {
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

class EditGebruikerInputs(Inputs):
    json = [JsonSchema(schema=edit_gebruiker_schema)]

class GebruikerDetailView(MethodView):

    def get(self, gebruiker_id):
        """ Get the current Gebruiker """
        return {"data": self.get_gebruiker(gebruiker_id).to_dic}

    def patch(self, gebruiker_id):
        """ Update the current Gebruiker """
        inputs = EditGebruikerInputs(request)
        if not inputs.validate():
            return {"errors": inputs.errors}, 400

        gebruiker = self.get_gebruiker(gebruiker_id)
        for key, value in request.json.items():
            setattr(gebruiker, key, value)
        db.session.commit()
        return {"data": gebruiker.to_dict()}, 202

    def delete(self, gebruiker_id):
        """ Delete the current Gebruiker """
        db.session.delete(self.get_gebruiker(gebruiker_id))
        db.session.commit()
        return {}, 204

    def get_gebruiker(self, gebruiker_id):
        """ Get Gebruiker object based on id """
        try:
            return db.session.query(Gebruiker).filter_by(id=gebruiker_id).one()
        except NoResultFound:
            abort(404)
