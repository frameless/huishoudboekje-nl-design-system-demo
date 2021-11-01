""" HHBView for /afdelingen/ path """
from models.afdeling import Afdeling
from core_service.views.hhb_view import HHBView
from flask import request, abort, make_response


class AfdelingView(HHBView):
    """ Methods for /afdelingen/ path """
    hhb_model = Afdeling

    validation_data = {
        "type": "object",
        "properties": {
            "id": {
                "type": "integer",
            },
            "naam": {
                "type": "string",
            },
            "organisatie_id": {
                "type": "integer",
            },
            "postadressen_ids": {
                "oneOf": [
                    {"type": "null"},
                    {
                        "type": "array",
                        "uniqueItems": True,
                        "items": {
                            "type": "string",
                            "minLength": 1,
                        }
                    }
                ]
            }
        },
        "required": []
    }

    def extend_get(self, **kwargs):
        """ Extend the get function with extra filter """
        self.add_filter_filter_organisaties()

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

    def add_filter_filter_organisaties(self):
        """ Add filter_organisaties filter based on the id of the afdeling model """
        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.organisatie_id.in_(ids))

        AfdelingView.filter_in_string('filter_organisaties', add_filter)

    # TODO afspraken en rekeningen filter.