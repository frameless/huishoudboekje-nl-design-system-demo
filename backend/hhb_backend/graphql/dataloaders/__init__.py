# TODO unify naming, filenames are singular, loader names are plural
from flask import request

from .afspraken_loader import AfsprakenByGebruikerLoader, AfsprakenByIdLoader, AfsprakenByRekeningLoader
from .bank_transactions_loader import (BankTransactionByCsmLoader, BankTransactionByIdLoader,
                                       BankTransactionByIsGeboektLoader)
from .configuratie_loader import ConfiguratieByIdLoader
from .csm_loader import CSMsByIdLoader
from .exports_loader import ExportsByIdLoader
from .gebruiker_loader import GebruikersByIdLoader
from .gebruikersactiviteit_loader import (GebruikersActiviteitenByAfsprakenLoader,
                                          GebruikersActiviteitenByGebruikersLoader, GebruikersActiviteitenByIdLoader)
from .grootboekrekening_loader import GrootboekrekeningenByIdLoader
from .journaalpost_loader import (
    JournaalpostenByIdLoader,
    JournaalpostenByTransactionLoader,
)
from .organisatie_loader import KvKDetailsLoader, OrganisatieByIdLoader
from .overschrijving_loader import (OverschrijvingByAfspraakLoader, OverschrijvingByExportLoader,
                                    OverschrijvingByIdLoader)
from .rekeningen_loader import (RekeningenByGebruikerLoader, RekeningenByIbanLoader, RekeningenByIdLoader,
                                RekeningenByOrganisatieLoader)
from .rubrieken_loader import RubriekByGrootboekrekeningLoader, RubriekByIdLoader


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
        self.afspraken_by_rekening = AfsprakenByRekeningLoader(loop=loop)
        self.rubrieken_by_id = RubriekByIdLoader(loop=loop)
        self.rubrieken_by_grootboekrekening = RubriekByGrootboekrekeningLoader(
            loop=loop
        )
        self.overschrijvingen_by_id = OverschrijvingByIdLoader(loop=loop)
        self.overschrijvingen_by_afspraak = OverschrijvingByAfspraakLoader(loop=loop)
        self.overschrijvingen_by_export = OverschrijvingByExportLoader(loop=loop)

        # Rekeningen
        self.rekeningen_by_id = RekeningenByIdLoader(loop=loop)
        self.rekeningen_by_gebruiker = RekeningenByGebruikerLoader(loop=loop)
        self.rekeningen_by_organisatie = RekeningenByOrganisatieLoader(loop=loop)
        self.rekeningen_by_iban = RekeningenByIbanLoader(loop=loop)

        # Transaction Service
        self.csms_by_id = CSMsByIdLoader(loop=loop)
        self.bank_transactions_by_id = BankTransactionByIdLoader(loop=loop)
        self.bank_transactions_by_csm = BankTransactionByCsmLoader(loop=loop)
        self.bank_transactions_by_is_geboekt = BankTransactionByIsGeboektLoader(loop=loop)

        self.grootboekrekeningen_by_id = GrootboekrekeningenByIdLoader(loop=loop)
        self.journaalposten_by_id = JournaalpostenByIdLoader(loop=loop)
        self.journaalposten_by_transaction = JournaalpostenByTransactionLoader(
            loop=loop
        )

        self.configuratie_by_id = ConfiguratieByIdLoader(loop=loop)

        # Exports
        self.exports_by_id = ExportsByIdLoader(loop=loop)

        self.gebruikersactiviteiten_by_id = GebruikersActiviteitenByIdLoader(loop=loop)
        self.gebruikersactiviteiten_by_gebruikers = (
            GebruikersActiviteitenByGebruikersLoader(loop=loop)
        )
        self.gebruikersactiviteiten_by_afspraken = (
            GebruikersActiviteitenByAfsprakenLoader(loop=loop)
        )

    def __getitem__(self, item: str):
        return getattr(self, item)


def hhb_dataloader() -> HHBDataLoader:
    return request.dataloader
