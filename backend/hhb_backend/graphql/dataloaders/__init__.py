from .gebruiker_loader import GebruikersByIdLoader
from .organisatie_loader import OrganisatieByIdLoader, KvKDetailsLoader
from .afspraken_loader import AfsprakenByIdLoader, AfsprakenByGebruikerLoader
from .rekeningen_loader import RekeningenByIdLoader, RekeningenByGebruikerLoader, RekeningenByOrganisatieLoader
from .csm_loader import CSMByIdLoader

class HHBDataLoader:
    """ Main Dataloader class for HHB """
    
    def __init__(self, loop):
        # Gebruikers
        self.gebruikers_by_id = GebruikersByIdLoader(loop=loop)

        # Organisaties
        self.organisaties_by_id = OrganisatieByIdLoader(loop=loop)
        self.organisaties_kvk_details = KvKDetailsLoader(loop=loop)

        # Afspraken
        self.afspraken_by_id = AfsprakenByIdLoader(loop=loop)
        self.afspraken_by_gebruiker = AfsprakenByGebruikerLoader(loop=loop)

        # Rekeningen
        self.rekeningen_by_id = RekeningenByIdLoader(loop=loop)
        self.rekeningen_by_gebruiker = RekeningenByGebruikerLoader(loop=loop)
        self.rekeningen_by_organisatie = RekeningenByOrganisatieLoader(loop=loop)

        # Customer Statement Messages
        self.csms_by_id = CSMsByIdLoader(loop=loop)