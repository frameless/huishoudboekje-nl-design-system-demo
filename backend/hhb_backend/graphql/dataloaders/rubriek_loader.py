from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL


class RubriekLoader(DataLoader):
    service = HHB_SERVICES_URL
    model = "rubrieken"

    def by_grootboekrekening(self, grootboekrekening_id: str) -> dict:
        return self.load_one(grootboekrekening_id, filter_item="filter_grootboekrekeningen")
