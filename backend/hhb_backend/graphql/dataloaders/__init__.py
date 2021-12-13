# TODO unify naming, filenames are singular, loader names are plural
from flask import request

from .alarm_loader import AlarmByIdLoader

from .afspraken_loader import AfsprakenByBurgerLoader, AfsprakenByIdLoader, AfsprakenByRekeningLoader, AfsprakenByAfdelingLoader
from .bank_transactions_loader import (BankTransactionByCsmLoader, BankTransactionByIdLoader,
                                       BankTransactionByIsGeboektLoader)
from .configuratie_loader import ConfiguratieByIdLoader
from .csm_loader import CSMsByIdLoader
from .exports_loader import ExportsByIdLoader
from .burger_loader import BurgersByHuishoudenLoader, BurgersByIdLoader
from .gebruikersactiviteit_loader import (GebruikersActiviteitenByAfsprakenLoader,
                                          GebruikersActiviteitenByBurgersLoader, GebruikersActiviteitenByIdLoader,
                                          GebruikersActiviteitenByHuishoudenLoader)
from .grootboekrekening_loader import GrootboekrekeningenByIdLoader
from .journaalpost_loader import (
    JournaalpostenByIdLoader,
    JournaalpostenByTransactionLoader,
)
from .organisatie_loader import OrganisatieByIdLoader # KvKDetailsLoader,
from .overschrijving_loader import (OverschrijvingByAfspraakLoader, OverschrijvingByExportLoader,
                                    OverschrijvingByIdLoader)
from .rekeningen_loader import (RekeningenByBurgerLoader, RekeningenByIbanLoader, RekeningenByIdLoader,
                                RekeningenByAfdelingLoader)
from .rubrieken_loader import RubriekByGrootboekrekeningLoader, RubriekByIdLoader
from .huishouden_loader import HuishoudensByIdLoader
from .afdeling_loader import AfdelingenByIdLoader, AfdelingenByOrganisatieLoader
from .postadressen_loader import PostadressenByIdLoader, PostadressenByAfdelingLoader, PostadressenByIdsLoader


class HHBDataLoader:
    """ Main Dataloader class for HHB """

    def __init__(self, loop):
        # Burgers
        self.burgers_by_id = BurgersByIdLoader(loop=loop)
        self.burgers_by_huishouden = BurgersByHuishoudenLoader(loop=loop)

        # Organisaties
        self.organisaties_by_id = OrganisatieByIdLoader(loop=loop)
        # Afspraken
        self.afspraken_by_id = AfsprakenByIdLoader(loop=loop)
        self.afspraken_by_burger = AfsprakenByBurgerLoader(loop=loop)
        self.afspraken_by_rekening = AfsprakenByRekeningLoader(loop=loop)
        self.afspraken_by_afdeling = AfsprakenByAfdelingLoader(loop=loop)
        self.rubrieken_by_id = RubriekByIdLoader(loop=loop)
        self.rubrieken_by_grootboekrekening = RubriekByGrootboekrekeningLoader(
            loop=loop
        )
        self.overschrijvingen_by_id = OverschrijvingByIdLoader(loop=loop)
        self.overschrijvingen_by_afspraak = OverschrijvingByAfspraakLoader(loop=loop)
        self.overschrijvingen_by_export = OverschrijvingByExportLoader(loop=loop)

        # Rekeningen
        self.rekeningen_by_id = RekeningenByIdLoader(loop=loop)
        self.rekeningen_by_burger = RekeningenByBurgerLoader(loop=loop)
        self.rekeningen_by_afdeling = RekeningenByAfdelingLoader(loop=loop)
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
        self.gebruikersactiviteiten_by_burgers = (
            GebruikersActiviteitenByBurgersLoader(loop=loop)
        )
        self.gebruikersactiviteiten_by_afspraken = (
            GebruikersActiviteitenByAfsprakenLoader(loop=loop)
        )
        self.gebruikersactiviteiten_by_huishouden = (
            GebruikersActiviteitenByHuishoudenLoader(loop=loop)
        )

        # Huishoudens
        self.huishoudens_by_id = HuishoudensByIdLoader(loop=loop)

        # Afdelingen
        self.afdelingen_by_id = AfdelingenByIdLoader(loop=loop)
        self.afdelingen_by_organisatie = AfdelingenByOrganisatieLoader(loop=loop)

        # Postadressen
        self.postadressen_by_id = PostadressenByIdLoader(loop=loop)
        self.postadressen_by_afdeling = PostadressenByAfdelingLoader(loop=loop)
        self.postadressen_by_ids = PostadressenByIdsLoader(loop=loop)

        # Alarmen
        self.alarmen_by_id = AlarmByIdLoader(loop=loop)

    def __getitem__(self, item: str):
        return getattr(self, item)


def hhb_dataloader() -> HHBDataLoader:
    return request.dataloader
