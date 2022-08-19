from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class AfspraakLoader(DataLoader):
    model = "afspraken"

    def by_postadres(self, postadres_id: str) -> List[dict]:
        return self.load(postadres_id, filter_item="filter_postadressen")

    def by_afdeling(self, afdeling_id: int) -> List[dict]:
        return self.load(afdeling_id, filter_item="filter_afdelingen")

    def by_burger(self, burger_id: int) -> List[dict]:
        return self.load(burger_id, filter_item="filter_burgers")

    def by_rekening(self, rekening_id: int) -> List[dict]:
        return self.load(rekening_id, filter_item="filter_rekening")

    def by_rekeningen(self, rekening_ids: List[int]) -> List[dict]:
        return self.load(rekening_ids, filter_item="filter_rekening")
