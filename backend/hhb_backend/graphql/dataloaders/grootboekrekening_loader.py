from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import GROOTBOEK_SERVICE_URL
from hhb_backend.service.model.grootboekrekening import Grootboekrekening


class GrootboekrekeningLoader(DataLoader[Grootboekrekening]):
    service = GROOTBOEK_SERVICE_URL
    model = "grootboekrekeningen"
