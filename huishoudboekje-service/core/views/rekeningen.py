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

    def get(self, **kwargs):
        object_id = self.get_object_id_from_kwargs(**kwargs)
        self.hhb_query.add_filter_columns()
        self.hhb_query.add_filter_ids()
        self.extend_get(**kwargs)
        if object_id:
            return self.hhb_query.get_result_single(object_id)
        return self.get_result_multiple()

    def get_result_multiple(self):
        """ Get multiple results from the current query """
        result_list = []
        for row in self.hhb_query.query.all():
            result_dict = row2dict(row)
            result_dict["gebruikers"] = [item.gebruiker_id for item in row.gebruikers]
            result_dict["organisaties"] = [item.organisatie_id for item in row.organisaties]
            result_list.append(result_dict)
        return {"data": result_list}, 200