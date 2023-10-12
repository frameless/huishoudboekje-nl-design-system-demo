""" MethodView for /afspraken/filter path """

from core_service.views.basic_view.basic_filter_view import BasicFilterView
from huishoudboekje_service.filters.afspraak_filters import add_afspraak_afspraak_ids_filter, add_afspraak_burger_ids_filter, add_afspraak_afdeling_ids_filter, add_afspraak_max_bedrag_filter, add_afspraak_min_bedrag_filter, add_afspraak_only_valid_filter, add_afspraak_tegen_rekening_ids_filter, add_afspraak_text_zoektermen_filter
from models.afspraak import Afspraak
from models.burger import Burger


class AfsprakenFilterView(BasicFilterView):
    """ Methods for /afspraken/filter path """

    model = "afspraken"

    def set_basic_query(self): 
        self.query = Afspraak.query.join(Burger).order_by(Burger.voornamen.asc(), Burger.achternaam.asc(), Afspraak.omschrijving.asc(),Afspraak.zoektermen.asc())

    def add_filter_options(self, filter_options, query):
        afspraak_ids = filter_options.get("afspraak_ids", None)
        burger_ids = filter_options.get("burger_ids", None)
        afdeling_ids = filter_options.get("afdeling_ids", None)
        tegen_rekening_ids = filter_options.get("tegen_rekening_ids", None)
        only_valid = filter_options.get("only_valid", None)
        min_bedrag = filter_options.get("min_bedrag", None)
        max_bedrag = filter_options.get("max_bedrag", None)
        zoektermen = filter_options.get("zoektermen", None)

        new_query = query

        if afspraak_ids:
            new_query = add_afspraak_afspraak_ids_filter(afspraak_ids, new_query)

        if burger_ids:
            new_query = add_afspraak_burger_ids_filter(burger_ids, new_query)

        if afdeling_ids:
            new_query = add_afspraak_afdeling_ids_filter(afdeling_ids, new_query)

        if tegen_rekening_ids is not None:
            new_query = add_afspraak_tegen_rekening_ids_filter(tegen_rekening_ids, new_query)

        if only_valid is not None:
            new_query = add_afspraak_only_valid_filter(only_valid, new_query)

        if min_bedrag:
            new_query = add_afspraak_min_bedrag_filter(min_bedrag, new_query)

        if max_bedrag:
            new_query = add_afspraak_max_bedrag_filter(max_bedrag, new_query)

        if zoektermen:
            new_query = add_afspraak_text_zoektermen_filter(zoektermen, new_query)

        
        return new_query