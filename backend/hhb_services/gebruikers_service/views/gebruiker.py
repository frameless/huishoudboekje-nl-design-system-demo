from flask.views import MethodView
from flask import request
from hhb_models.gebruiker import Gebruiker
from gebruikers_service.database import db

class GebruikerView(MethodView):

    def get(self):
        """ Get a list of all Gebruikers """
        gebruikers = Gebruiker.query.all()
        return {"data": [g.to_dict() for g in gebruikers]} 

    def post(self):
        """ Add a new Gebruiker """
        if not request.json:
            return "Missing user data", 400
        gebruiker = Gebruiker()
        gebruiker.telefoon = request.json["telefoonnummer"]
        gebruiker.email = request.json["email"]
        gebruiker.geboortedatum = request.json["geboortedatum"]
        db.session.add(gebruiker)
        db.session.commit()
        return {"data": gebruiker.to_dict()}, 201