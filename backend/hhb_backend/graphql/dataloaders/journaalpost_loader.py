from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader


class JournaalpostenByIdLoader(SingleDataLoader):
    """ Load journaalposten using ids """
    model = "journaalposten"
    service = settings.HHB_SERVICES_URL
