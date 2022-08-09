from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class AfdelingenByIdLoader(DataLoader):
    """ Load Afdelingen using ids """
    model = "afdelingen"
    service = settings.ORGANISATIE_SERVICES_URL


class AfdelingenByOrganisatieLoader(DataLoader):
    """ Load Afdelingen using ids """
    model = "afdelingen"
    service = settings.ORGANISATIE_SERVICES_URL
    filter_item = "filter_organisaties"
