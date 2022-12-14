""" Rekening View """
from flask import request, make_response, abort
from models.rekening import Rekening
from models.rekening_burger import RekeningBurger
from models.rekening_afdeling import RekeningAfdeling
from core_service.views.hhb_view import HHBView


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
                "maxLength": Rekening.get_max_rekeninghouder_length()
            },
        },
        "required": []
    }

    def extend_get(self, **kwargs):
        self.add_filter_burgers()
        self.add_filter_afdelingen()
        self.add_filter_ibans()
        self.add_filter_rekeninghouders()
        self.add_relations()
        
    def add_filter_burgers(self):
        filter_burgers = request.args.get('filter_burgers')
        if filter_burgers:
            try:
                self.hhb_query.query = self.hhb_query.query.\
                    join(Rekening.burgers).\
                    filter(
                        RekeningBurger.burger_id.in_([int(burger) for burger in filter_burgers.split(",")])
                    )
            except ValueError: 
                abort(make_response({"errors": [f"Input for filter_burgers is not correct."]}, 400))

    def add_filter_afdelingen(self):
        filter_afdelingen = request.args.get('filter_afdelingen')
        if filter_afdelingen:
            try:
                self.hhb_query.query = self.hhb_query.query. \
                    join(Rekening.afdelingen). \
                    filter(
                    RekeningAfdeling.afdeling_id.in_(
                        [int(afdeling) for afdeling in
                         filter_afdelingen.split(",")])
                )
            except ValueError:
                abort(make_response({"errors": [
                    f"Input for filter_afdelingen is not correct."]}, 400))

    def add_filter_ibans(self):
        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(
                Rekening.iban.in_(ids)
            )
        
        RekeningView.filter_in_string('filter_ibans', add_filter)            
  
    def add_filter_rekeninghouders(self):
        def add_filter(rekeninghouders):
            self.hhb_query.query = self.hhb_query.query.filter(
                Rekening.rekeninghouder.in_(rekeninghouders)
            )
        
        RekeningView.filter_in_string('filter_rekeninghouders', add_filter)            

    def add_relations(self, **kwargs):
        self.hhb_query.expose_many_relation("burgers", "burger_id")
        self.hhb_query.expose_many_relation("afspraken", "id")
        self.hhb_query.expose_many_relation("afdelingen", "afdeling_id")
