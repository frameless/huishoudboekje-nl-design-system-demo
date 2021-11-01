from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader, ListDataLoader


class AfdelingenByIdLoader(SingleDataLoader):
    """ Load Afdelingen using ids """
    model = "afdelingen"
    service = settings.ORGANISATIE_SERVICES_URL

class AfdelingenByOrganisatieLoader(ListDataLoader):
    """ Load Afdelingen using ids """
    model = "afdelingen"
    service = settings.ORGANISATIE_SERVICES_URL
    filter_item = "filter_organisaties"
    index = "organisatie_id"