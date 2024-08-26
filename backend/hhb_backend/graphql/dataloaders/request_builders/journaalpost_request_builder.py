
from hhb_backend.graphql.dataloaders.request_builders.request_builder import GetRequestBuilder
from hhb_backend.graphql.settings import HHB_SERVICES_URL


class JournaalpostGetRequestBuilder(GetRequestBuilder):

    service = HHB_SERVICES_URL
    model = "journaalposten"

    def by_ids(self, ids: list[int]):
        self._request.add_to_filter("ids", ids)
        return self

    def by_transation_uuids(self, transation_uuids: list[str]):
        self._request.add_to_filter("transation_uuids", transation_uuids)
        return self
    
    
    def by_burger_ids(self, burger_ids: list[int]):
        self._request.add_to_filter("burger_ids", burger_ids)
        return self
    
    def by_automatically_booked(self, only_booked: bool):
        self._request.add_to_filter("automatisch_geboekt", only_booked)
        return self
