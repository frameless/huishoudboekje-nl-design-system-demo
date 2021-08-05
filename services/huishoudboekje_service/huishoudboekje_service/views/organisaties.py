""" MethodView for /organisaties/<organisatie_id>/ path """
from flask import request, abort, make_response
from models.organisatie import Organisatie
from core_service.views.hhb_view import HHBView

class OrganisatieView(HHBView):
    """ Methods for /organisaties/ path """

    hhb_model = Organisatie
    validation_data = {
        "type": "object",
        "properties": {
            "kvk_nummer": {
                "type": "string",
            },
            "vestigingsnummer": {
                "type": "string",
            },
        },
        "required": []
    }

    def extend_get(self, **kwargs):
        """ Extend the get function with a filer on kvk nummers """
        self.add_filter_filter_kvks()
        self.hhb_query.expose_many_relation("afspraken", "id")

    def add_filter_filter_kvks(self):
        """ Add filter_ids filter based on the kvk of the organisatie model """
        filter_ids = request.args.get('filter_kvks')
        if filter_ids:
            ids = []
            for raw_id in filter_ids.split(","):
                try:
                    ids.append(int(raw_id))
                except ValueError:
                    abort(make_response({"errors": [f"Input for filter_kvks is not correct, '{raw_id}' is not a number."]}, 400))
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.id.in_(ids))

