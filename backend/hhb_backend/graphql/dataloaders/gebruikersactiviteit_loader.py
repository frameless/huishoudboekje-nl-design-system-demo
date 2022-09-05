from typing import List

from typing_extensions import Unpack

from hhb_backend.graphql.dataloaders.base_loader import DataLoader, DataLoaderOptions
from hhb_backend.graphql.settings import LOG_SERVICE_URL


class GebruikersactiviteitLoader(DataLoader):
    service = LOG_SERVICE_URL
    model = "gebruikersactiviteiten"

    def by_burger(self, burger_id: int) -> List[dict]:
        return self.load(burger_id, filter_item="filter_burgers")

    def by_burgers(self, burger_ids: List[int]) -> List[dict]:
        return self.load(burger_ids, filter_item="filter_burgers")

    def by_burgers_paged(self, keys: List[int] = None, **kwargs: Unpack[DataLoaderOptions]):
        return self.load_paged(keys, filter_item="filter_burgers", **kwargs)

    def by_afspraak(self, afspraak_id: int) -> List[dict]:
        return self.load(afspraak_id, filter_item="filter_afspraken")

    def by_afspraken_paged(self, keys: List[int] = None, **kwargs: Unpack[DataLoaderOptions]):
        return self.load_paged(keys=keys, filter_item="filter_afspraken", **kwargs)

    def by_huishouden(self, huishouden_id: int) -> List[dict]:
        return self.load(huishouden_id, filter_item="filter_huishouden")

    def by_huishouden_paged(self, keys: List[int] = None, **kwargs: Unpack[DataLoaderOptions]):
        return self.load_paged(keys=keys, filter_item="filter_huishouden", **kwargs)
