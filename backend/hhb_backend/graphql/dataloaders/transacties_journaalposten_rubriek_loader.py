from typing import List

from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL
from hhb_backend.service.model.journaalpost import JournaalpostTransactieRubriek


class JournaalpostRubriekLoader(DataLoader[JournaalpostTransactieRubriek]):
    service = HHB_SERVICES_URL
    model = "transacties_journaalpost_rubriek"
