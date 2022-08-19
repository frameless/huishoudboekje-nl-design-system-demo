from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class RubriekLoader(DataLoader):
    model = "rubrieken"

    def by_grootboekrekening(self, grootboekrekening_id: str) -> dict:
        return self.load_one(grootboekrekening_id, filter_item="filter_grootboekrekeningen")
