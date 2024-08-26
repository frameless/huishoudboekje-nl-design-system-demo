""" MethodView for /afspraken/search path """
from core_service.views.basic_view.basic_filter_view import BasicFilterView
from huishoudboekje_service.filters.afspraak_filters import add_afspraak_burger_ids_filter
from models.journaalpost import Journaalpost
from models.afspraak import Afspraak

class JournaalpostenFilterView(BasicFilterView):
    """ Methods for /banktransactions/filter path """

    model = "journaalposten"

    def set_basic_query(self):
        self.query = Journaalpost.query

    def add_filter_options(self, filter_options, query):
        ids = filter_options.get("ids", None)
        transation_uuids = filter_options.get("transation_uuids", None)
        automatisch_geboekt = filter_options.get("automatisch_geboekt", None)

        burger_ids = filter_options.get("burger_ids", None)

        new_query = query
        if ids is not None:
            new_query = new_query.filter(Journaalpost.id.in_(ids))

        if transation_uuids is not None:
            new_query = new_query.filter(Journaalpost.transaction_uuid.in_(transation_uuids))

        if automatisch_geboekt is not None:
            new_query = new_query.filter(Journaalpost.is_automatisch_geboekt.is_(automatisch_geboekt))
        
        if burger_ids is not None:
            new_query = new_query.join(Afspraak)
            new_query = add_afspraak_burger_ids_filter(burger_ids, new_query)

        return new_query