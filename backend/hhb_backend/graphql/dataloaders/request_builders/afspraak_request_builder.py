
from hhb_backend.graphql.dataloaders.request_builders.request_builder import GetRequestBuilder
from hhb_backend.graphql.dataloaders.request_object import GetRequestObject
from hhb_backend.graphql.settings import HHB_SERVICES_URL


class AfsprakenGetRequestBuilder(GetRequestBuilder):

    service = HHB_SERVICES_URL
    model = "afspraken"

    def by_afspraak_ids(self, afspraak_ids: list[int]):
        self._request.add_to_filter("afspraak_ids", afspraak_ids)
        return self

    def by_burger_ids(self, burger_ids: list[int]):
        self._request.add_to_filter("burger_ids", burger_ids)
        return self

    def by_afdeling_ids(self, afdeling_ids: list[int]):
        self._request.add_to_filter("afdeling_ids", afdeling_ids)
        return self
    
    def by_tegen_rekening_ids(self, tegen_rekening_ids: list[int]):
        self._request.add_to_filter("tegen_rekening_ids", tegen_rekening_ids)
        return self
    
    def by_valid(self, only_valid: bool):
        self._request.add_to_filter("only_valid", only_valid)
        return self
    
    def by_min_bedrag(self, min_bedrag: int):
        self._request.add_to_filter("min_bedrag", min_bedrag)
        return self
    
    def by_max_bedrag(self, max_bedrag: int):
        self._request.add_to_filter("max_bedrag", max_bedrag)
        return self

    def by_zoektermen(self, zoektermen: list[str]):
        self._request.add_to_filter("zoektermen", zoektermen)
        return self
