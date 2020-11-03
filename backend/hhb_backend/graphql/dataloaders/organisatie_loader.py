from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader

class OrganisatieByIdLoader(SingleDataLoader):
    model = "organisaties"

class KvKDetailsLoader(SingleDataLoader):
    model = "organisaties"
    filter_item = "filter_kvks"
    service = settings.ORGANISATIE_SERVICES_URL
    index = "kvk_nummer"
