from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader, ListDataLoader

class RekeningenByIdLoader(SingleDataLoader):
    model = "rekeningen"

class RekeningenByGebruikerLoader(ListDataLoader):
    model = "rekeningen"
    service = settings.HHB_SERVICES_URL
    filter_item = "filter_gebruikers"
    index = "gebruikers"
    is_list = True

class RekeningenByOrganisatieLoader(ListDataLoader):
    model = "rekeningen"
    service = settings.HHB_SERVICES_URL
    filter_item = "filter_organisaties"
    index = "organisaties"
    is_list = True