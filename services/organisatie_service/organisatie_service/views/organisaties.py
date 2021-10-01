""" HHBView for /organisaties/ path """
from models.organisatie import Organisatie
from core_service.views.hhb_view import HHBView
from flask import request, abort, make_response


class OrganisatieView(HHBView):
    """ Methods for /organisaties/ path """
    hhb_model = Organisatie

    validation_data = {
   "type": "object",
   "properties": {
        "id": {
            "type": "integer",
        },
        "kvknummer": {
            "type": "string",
        },
        "vestigingsnummer": {
            "type": "string",
        },
       "naam": {
           "type": "string",
       }
   },
   "required": []
}

    def extend_get(self, **kwargs):
        """ Extend the get function with extra filter """
        self.add_filter_filter_afdelingen()

    @staticmethod
    def filter_in_string(name, cb):
        filter_string = request.args.get(name)
        if filter_string:
            ids = []
            for raw_id in filter_string.split(","):
                try:
                    ids.append(int(raw_id))
                except ValueError:
                    abort(make_response(
                        {"errors": [
                            f"Input for {name} is not correct, '{raw_id}' is not a number."]},
                        400))
            cb(ids)

    def add_filter_filter_afdelingen(self):
        """ Add filter_afdelingen filter based on the id of the organisatie model """

        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(
                self.hhb_model.afdeling_id.in_(ids))

        OrganisatieView.filter_in_string('filter_afdelingen', add_filter)

