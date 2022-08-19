from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class CSMLoader(DataLoader):
    service = settings.TRANSACTIE_SERVICES_URL
    model = "customerstatementmessages"
