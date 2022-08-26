from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import TRANSACTIE_SERVICES_URL


class CSMLoader(DataLoader):
    service = TRANSACTIE_SERVICES_URL
    model = "customerstatementmessages"
