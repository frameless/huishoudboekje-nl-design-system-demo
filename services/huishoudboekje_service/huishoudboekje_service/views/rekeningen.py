""" Rekening View """
from flask import request, make_response, abort
from models.rekening import Rekening
from models.rekening_gebruiker import RekeningGebruiker 
from models.rekening_organisatie import RekeningOrganisatie
from core_service.views.hhb_view import HHBView
from core_service.utils import row2dict

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
            try:
                self.hhb_query.query = self.hhb_query.query.\
                    join(Rekening.gebruikers).\
                    filter(
                        RekeningGebruiker.gebruiker_id.in_([int(gebruiker) for gebruiker in filter_gebruikers.split(",")])
                    )
            except ValueError: 
                abort(make_response({"errors": [f"Input for filter_gebruikers is not correct."]}, 400))

    def add_filter_organisaties(self):
        filter_organisaties = request.args.get('filter_organisaties')
        if filter_organisaties:
            try:
                self.hhb_query.query = self.hhb_query.query.\
                    join(Rekening.organisaties).\
                    filter(
                        RekeningOrganisatie.organisatie_id.in_([int(organisatie) for organisatie in filter_organisaties.split(",")])
                    )
            except ValueError: 
                abort(make_response({"errors": [f"Input for filter_organisaties is not correct."]}, 400))

    def add_filter_ibans(self):
        filter_ibans = request.args.get('filter_ibans')
        if filter_ibans:
            self.hhb_query.query = self.hhb_query.query.filter(
                Rekening.iban.in_(filter_ibans.split(","))
            )
  
    def add_filter_rekeninghouders(self):
        filter_rekeninghouders = request.args.get('filter_rekeninghouders')
        if filter_rekeninghouders:
            self.hhb_query.query = self.hhb_query.query.filter(
                Rekening.rekeninghouder.in_(filter_rekeninghouders.split(","))
            )

    def add_relations(self, **kwargs):
        self.hhb_query.expose_many_relation("gebruikers", "gebruiker_id")
        self.hhb_query.expose_many_relation("organisaties", "organisatie_id")
        self.hhb_query.expose_many_relation("afspraken", "id")
