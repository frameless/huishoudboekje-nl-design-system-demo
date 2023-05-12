
from hhb_backend.graphql.dataloaders.request_builders.request_builder import GetRequestBuilder
from hhb_backend.graphql.settings import TRANSACTIE_SERVICES_URL


class TransactionGetRequestBuilder(GetRequestBuilder):

    service = TRANSACTIE_SERVICES_URL
    model = "banktransactions"

    def by_ids(self, ids: list[int]):
        self._request.add_to_filter("ids", ids)
        return self
    
    def by_bedrag(self, min_bedrag: int,  max_bedrag: int):
        if min_bedrag is not None:
            self._request.add_to_filter("min_bedrag", min_bedrag)
        if max_bedrag is not None:
            self._request.add_to_filter("max_bedrag", max_bedrag)
        return self
    
    def by_date(self, start_date: str,  end_date: str):
        if start_date is not None:
            self._request.add_to_filter("start_date", start_date)
        if end_date is not None:
            self._request.add_to_filter("end_date", end_date)
        return self

    def by_ibans(self, ibans: list[str]):
        self._request.add_to_filter("ibans", ibans)
        return self
    
    def by_booked(self, only_booked: bool):
        self._request.add_to_filter("only_booked", only_booked)
        return self
    
    def by_credit(self, only_credit: bool):
        self._request.add_to_filter("only_credit", only_credit)
        return self

    def by_zoektermen(self, zoektermen: list[str]):
        self._request.add_to_filter("zoektermen", zoektermen)
        return self
