from .gebruiker_loader import GebruikersByIdLoader
from .organisatie_loader import OrganisatieByIdLoader, KvKDetailsLoader
from .afspraken_loader import AfsprakenByIdLoader, AfsprakenByGebruikerLoader
from .rekeningen import RekeningenByIdLoader, RekeningenByGebruikerLoader, RekeningenByOrganisatieLoader

class HHBDataLoader:
    
    def __init__(self, loop):
        self.gebruikers_by_id = GebruikersByIdLoader(loop=loop)
        self.organisaties_by_id = OrganisatieByIdLoader(loop=loop)
        self.organisaties_kvk_details = KvKDetailsLoader(loop=loop)
        self.afspraken_by_id = AfsprakenByIdLoader(loop=loop)
        self.afspraken_by_gebruiker = AfsprakenByGebruikerLoader(loop=loop)
        self.rekeningen_by_id = RekeningenByIdLoader(loop=loop)
        self.rekeningen_by_gebruiker = RekeningenByGebruikerLoader(loop=loop)
        self.rekeningen_by_organisatie = RekeningenByOrganisatieLoader(loop=loop)