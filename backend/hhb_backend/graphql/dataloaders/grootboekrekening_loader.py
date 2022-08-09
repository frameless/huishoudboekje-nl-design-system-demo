from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class GrootboekrekeningenByIdLoader(DataLoader):
    """ Load grootboekrekeningen using ids """
    model = "grootboekrekeningen"
    service = settings.GROOTBOEK_SERVICE_URL
