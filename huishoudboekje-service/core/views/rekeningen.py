""" Rekening View """
from flask import request
from models.rekening import Rekening
from models.rekening_gebruiker import RekeningGebruiker 
from models.rekening_organisatie import RekeningOrganisatie
from core.views.hhb_view import HHBView
from core.utils import row2dict

class RekeningView(HHBView):
    """ Methods for /rekeningen/ path """

    hhb_model = Rekening
    validation_data = {
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

    def extend_get(self, **kwargs):
        self.add_filter_gebruikers()
        self.add_filter_organisaties()
        self.add_filter_ibans()
        self.add_filter_rekeninghouders()
        self.add_relations()
        
    def add_filter_gebruikers(self):
        filter_gebruikers = request.args.get('filter_gebruikers')
        if filter_gebruikers:
            self.hhb_query.query = self.hhb_query.query.\
                join(Rekening.gebruikers).\
                filter(
                    RekeningGebruiker.gebruiker_id.in_([int(gebruiker) for gebruiker in filter_gebruikers.split(",")])
                )

    def add_filter_organisaties(self):
        filter_organisaties = request.args.get('filter_organisaties')
        if filter_organisaties:
            self.hhb_query.query = self.hhb_query.query.\
                join(Rekening.organisaties).\
                filter(
                    RekeningOrganisatie.organisatie_id.in_([int(organisatie) for organisatie in filter_organisaties.split(",")])
                )

    def add_filter_ibans(self):
        filter_ibans = request.args.get('filter_ibans')
        if filter_ibans:
            try:
                self.hhb_query.query = self.hhb_query.query.filter(
                    Rekening.iban.in_([ibans for ibans in filter_ibans.split(",")])
                )
            except ValueError:
                return {"errors": ["Input for filter_ibans is not correct"]}, 400

    def add_filter_rekeninghouders(self):
        filter_rekeninghouders = request.args.get('filter_rekeninghouders')
        if filter_rekeninghouders:
            try:
                self.hhb_query.query = self.hhb_query.query.filter(
                    Rekening.rekeninghouder.in_([rekhouder for rekhouder in filter_rekeninghouders.split(",")])
                )
            except ValueError:
                return {"errors": ["Input for filter_rekeninghouders is not correct"]}, 400

    def add_relations(self, **kwargs):
        self.hhb_query.expose_many_relation("gebruikers", "gebruiker_id")
        self.hhb_query.expose_many_relation("organisaties", "organisatie_id")
        self.hhb_query.expose_many_relation("afspraken", "id")
