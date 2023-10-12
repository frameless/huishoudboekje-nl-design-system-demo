""" HHBView for /organisaties/ path """
from models.organisatie import Organisatie
from core_service.views.hhb_view import HHBView


class OrganisatieView(HHBView):
    """ Methods for /organisaties/ path """
    hhb_model = Organisatie

    validation_data = {
   "type": "object",
   "properties": {
        "id": {
            "type": "string",
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

    def add_filter_filter_afdelingen(self):
        """ Add filter_afdelingen filter based on the id of the organisatie model """

        def add_filter(ids):
            self.hhb_query.query = self.hhb_query.query.filter(
                self.hhb_model.afdeling_id.in_(ids)
            )

        OrganisatieView.filter_in_string('filter_afdelingen', add_filter)

