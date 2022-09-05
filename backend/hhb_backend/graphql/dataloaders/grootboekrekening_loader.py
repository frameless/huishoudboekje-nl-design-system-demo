from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import GROOTBOEK_SERVICE_URL


class GrootboekrekeningLoader(DataLoader):
    service = GROOTBOEK_SERVICE_URL
    model = "grootboekrekeningen"
