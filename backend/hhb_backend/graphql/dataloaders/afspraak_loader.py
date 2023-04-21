from typing import List
import requests
from hhb_backend.graphql.dataloaders.request_filter import RequestFilter
from graphql import GraphQLError
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError

from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL
from hhb_backend.service.model.afspraak import Afspraak


class AfspraakLoader(DataLoader[Afspraak]):
    service = HHB_SERVICES_URL
    model = "afspraken"

    def by_postadres(self, postadres_id: str) -> List[Afspraak]:
        return self.load(postadres_id, filter_item="filter_postadressen")

    def by_afdeling(self, afdeling_id: int) -> List[Afspraak]:
        return self.load(afdeling_id, filter_item="filter_afdelingen")

    def by_burger(self, burger_id: int) -> List[Afspraak]:
        return self.load(burger_id, filter_item="filter_burgers")

    def by_rekening(self, rekening_id: int) -> List[Afspraak]:
        return self.load(rekening_id, filter_item="filter_rekening")

    def by_rekeningen(self, rekening_ids: List[int]) -> List[Afspraak]:
        return self.load(rekening_ids, filter_item="filter_rekening")

    def in_date_range(self, valid_from: str, valid_through: str) -> List[Afspraak]:
        return self.load_all(params={
            'valid_from': valid_from,
            'valid_through': valid_through
        })
    
    def load_search(self, filter: RequestFilter):
        try:
            url = f"{self.service}/{self.model}/search"
            response = requests.get(url, json=filter.body, params=filter.params)

        except requests.exceptions.ConnectionError:
            raise GraphQLError(f"Failed to connect to service {self.service}")
        
        if response.status_code != 200:
            raise UpstreamError(response, f"Request to {url} failed.")
        
        return  response.json()


class AfsprakenFilterBuilder():

    def __init__(self) -> None:
        self.reset()

    def reset(self):
        self._request_filter = RequestFilter()

    @property
    def request_filter(self) -> RequestFilter:
        request_filter = self._request_filter
        self.reset()
        return request_filter

    def paged(self, limit: int, offset: int):
        self._request_filter.add_to_params("limit", limit)
        self._request_filter.add_to_params("offset", offset)

    def by_afspraak_ids(self, afspraak_ids: list[int]):
        self._request_filter.add_to_body("afspraak_ids", afspraak_ids)

    def by_burger_ids(self, burger_ids: list[int]):
        self._request_filter.add_to_body("burger_ids", burger_ids)

    def by_afdeling_ids(self, afdeling_ids: list[int]):
        self._request_filter.add_to_body("afdeling_ids", afdeling_ids)
    
    def by_valid(self, valid: bool):
        self._request_filter.add_to_body("only_valid", valid)
    
    def by_min_bedrag(self, min_bedrag: int):
        self._request_filter.add_to_body("min_bedrag", min_bedrag)
    
    def by_max_bedrag(self, max_bedrag: int):
        self._request_filter.add_to_body("max_bedrag", max_bedrag)

    def by_zoektermen(self, zoektermen: list[str]):
        self._request_filter.add_to_body("zoektermen", zoektermen)
