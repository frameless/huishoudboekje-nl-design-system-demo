from hhb_backend.graphql.dataloaders.base_loader_concept import DataLoaderConcept
from hhb_backend.graphql.dataloaders.request_object import GetRequestObject
from hhb_backend.graphql.settings import HHB_SERVICES_URL

class AfspraakLoaderConcept(DataLoaderConcept):
    """
    No implementation for now, later it should get a load_batch_fn
    """
    ...


class AfsprakenGetRequestBuilder():

    service = HHB_SERVICES_URL
    model = "afspraken"

    def __init__(self) -> None:
        self.reset()
        
    def reset(self):
        self._request = GetRequestObject()
        self._request.set_base_url(self.service)
        self._request.set_model(self.model)
        self._request.add_url_segment("search")


    @property
    def request(self) -> GetRequestObject:
        request = self._request
        self.reset()
        return request

    def paged(self, limit: int, offset: int):
        self._request.add_to_params("limit", limit)
        self._request.add_to_params("offset", offset)
        return self

    def by_afspraak_ids(self, afspraak_ids: list[int]):
        self._request.add_to_search("afspraak_ids", afspraak_ids)
        return self

    def by_burger_ids(self, burger_ids: list[int]):
        self._request.add_to_search("burger_ids", burger_ids)
        return self

    def by_afdeling_ids(self, afdeling_ids: list[int]):
        self._request.add_to_search("afdeling_ids", afdeling_ids)
        return self
    
    def by_valid(self, only_valid: bool):
        self._request.add_to_search("only_valid", only_valid)
        return self
    
    def by_min_bedrag(self, min_bedrag: int):
        self._request.add_to_search("min_bedrag", min_bedrag)
        return self
    
    def by_max_bedrag(self, max_bedrag: int):
        self._request.add_to_search("max_bedrag", max_bedrag)
        return self

    def by_zoektermen(self, zoektermen: list[str]):
        self._request.add_to_search("zoektermen", zoektermen)
        return self
