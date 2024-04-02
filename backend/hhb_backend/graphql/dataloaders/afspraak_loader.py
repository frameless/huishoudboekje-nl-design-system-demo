from typing import List
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
    
    def by_uuids(self, uuid: List[str]) -> List[Afspraak]:
        return self.load(uuid, filter_item="filter_uuid")
