# TODO unify naming, filenames are singular, loader names are plural
from .gebruiker_loader import GebruikersByIdLoader
from .grootboekrekening_loader import GrootboekrekeningenByIdLoader
from .journaalpost_loader import JournaalpostenByIdLoader, JournaalpostenByTransactionLoader
from .organisatie_loader import OrganisatieByIdLoader, KvKDetailsLoader
from .afspraken_loader import AfsprakenByIdLoader, AfsprakenByGebruikerLoader
from .rekeningen_loader import RekeningenByIdLoader, RekeningenByGebruikerLoader, RekeningenByOrganisatieLoader, RekeningenByIbanLoader
from .csm_loader import CSMsByIdLoader
from .bank_transactions_loader import BankTransactionByIdLoader, BankTransactionByCsmLoader
from .configuratie_loader import ConfiguratieByIdLoader
from .rubrieken_loader import RubriekByIdLoader, RubriekByGrootboekrekeningLoader
from .exports_loader import ExportsByIdLoader
from .overschrijving_loader import OverschrijvingByIdLoader, OverschijvingByAfspraakLoader

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
        self.rubrieken_by_id = RubriekByIdLoader(loop=loop)
        self.rubrieken_by_grootboekrekening = RubriekByGrootboekrekeningLoader(loop=loop)
        self.overschrijvingen_by_id = OverschrijvingByIdLoader(loop=loop)
        self.overschrijvingen_by_afspraak = OverschijvingByAfspraakLoader(loop=loop)

        # Rekeningen
        self.rekeningen_by_id = RekeningenByIdLoader(loop=loop)
        self.rekeningen_by_gebruiker = RekeningenByGebruikerLoader(loop=loop)
        self.rekeningen_by_organisatie = RekeningenByOrganisatieLoader(loop=loop)
        self.rekeningen_by_iban = RekeningenByIbanLoader(loop=loop)

        # Transaction Service
        self.csms_by_id = CSMsByIdLoader(loop=loop)
        self.bank_transactions_by_id = BankTransactionByIdLoader(loop=loop)
        self.bank_transactions_by_csm = BankTransactionByCsmLoader(loop=loop)

        self.grootboekrekeningen_by_id = GrootboekrekeningenByIdLoader(loop=loop)
        self.journaalposten_by_id = JournaalpostenByIdLoader(loop=loop)
        self.journaalposten_by_transaction = JournaalpostenByTransactionLoader(loop=loop)

        self.configuratie_by_id = ConfiguratieByIdLoader(loop=loop)

        self.exports_by_id = ExportsByIdLoader(loop=loop)
