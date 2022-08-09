from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader

class CSMsByIdLoader(DataLoader):
    """ Load customer statement messages using ids """
    model = "customerstatementmessages"
    service = settings.TRANSACTIE_SERVICES_URL
