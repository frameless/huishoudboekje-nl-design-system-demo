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

    def add_filter_filter_organisaties(self):
        """ Add filter_organisaties filter based on the id of the afdeling model """
        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(self.hhb_model.organisatie_id.in_(ids))

        AfdelingView.filter_in_string('filter_organisaties', add_filter)

    # TODO afspraken en rekeningen filter.