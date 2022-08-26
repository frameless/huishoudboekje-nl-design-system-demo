from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL
from hhb_backend.service.model.rubriek import Rubriek


class RubriekLoader(DataLoader[Rubriek]):
    service = HHB_SERVICES_URL
    model = "rubrieken"

    def by_grootboekrekening(self, grootboekrekening_id: str) -> Rubriek:
        return self.load_one(grootboekrekening_id, filter_item="filter_grootboekrekeningen")
