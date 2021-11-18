from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader, ListDataLoader
from hhb_backend.graphql import settings

class PostadressenByIdLoader(SingleDataLoader):
    """ Load postadressen contactcatalogus using ids"""
    model = "addresses"
    service = settings.CONTACTCATALOGUS_SERVICE_URL

class PostadressenByIdsLoader(SingleDataLoader):
    """ Load postadressen from organisatieservice using afdeling id"""
    model = "postadressen"
    service = settings.ORGANISATIE_SERVICES_URL
    filter_item = "id"
    index = "id"

class PostadressenByAfdelingLoader(ListDataLoader):
    """ Load postadressen from organisatieservice using afdeling id"""
    model = "postadressen"
    service = settings.ORGANISATIE_SERVICES_URL
    filter_item = "filter_afdeling"
    index = "afdeling_id"
