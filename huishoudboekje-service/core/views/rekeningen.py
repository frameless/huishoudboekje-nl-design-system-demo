""" Rekening View """
from flask import request
from models.rekening import Rekening
from core.views.hhb_view import HHBView

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
        self.add_filter_ibans()
        self.add_filter_rekeninghouders()
        
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
