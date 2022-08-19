from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class GrootboekrekeningLoader(DataLoader):
    service = settings.GROOTBOEK_SERVICE_URL
    model = "grootboekrekeningen"
