from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader, ListDataLoader

class RekeningenByIdLoader(SingleDataLoader):
    """ Load rekeningen using ids """
    model = "rekeningen"

class RekeningenByGebruikerLoader(ListDataLoader):
    """ Load rekeningen list for gebruiker ids """
    model = "rekeningen"
    filter_item = "filter_gebruikers"
    index = "gebruikers"
    is_list = True

class RekeningenByOrganisatieLoader(ListDataLoader):
    """ Load rekeningen list for organisatie ids """
    model = "rekeningen"
    filter_item = "filter_organisaties"
    index = "organisaties"
    is_list = True

class RekeningenByIbanLoader(SingleDataLoader):
    """ Load rekeningen list for ibans """
    model = "rekeningen"
    filter_item = "filter_ibans"
    index = "iban"
