
from hhb_backend.graphql.dataloaders.request_object import GetRequestObject
from hhb_backend.graphql.settings import HHB_SERVICES_URL


class GetRequestBuilder():

    service = None
    model = None

    def __init__(self) -> None:
        self.reset()
        
    def reset(self):
        self._request = GetRequestObject()
        self._request.set_base_url(self.service)
        self._request.set_model(self.model)
        self._request.add_url_segment("filter")

    @property
    def request(self) -> GetRequestObject:
        request = self._request
        self.reset()
        return request

    def paged(self, limit: int, offset: int):
        self._request.add_to_params("limit", limit)
        self._request.add_to_params("offset", offset)
        return self

