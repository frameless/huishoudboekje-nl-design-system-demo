# TODO unify naming, filenames are singular, loader names are plural
from asyncio import AbstractEventLoop

from flask import request

from .afdeling_loader import AfdelingenByIdLoader, AfdelingenByOrganisatieLoader
from .afspraken_loader import AfsprakenByBurgerLoader, AfspraakByIdLoader, AfsprakenByRekeningLoader, \
    AfsprakenByAfdelingLoader, AfsprakenByPostadresLoader
from .alarm_loader import AlarmByIdLoader, AlarmenLoader
from .bank_transactions_loader import (BankTransactionByCsmLoader, BankTransactionByIdLoader,
                                       BankTransactionByIsGeboektLoader)
from .burger_loader import BurgersByHuishoudenLoader, BurgerByIdLoader
from .configuratie_loader import ConfiguratieByIdLoader
from .csm_loader import CSMsByIdLoader
from .exports_loader import ExportByIdLoader
from .gebruikersactiviteit_loader import (GebruikersActiviteitenByAfsprakenLoader,
                                          GebruikersactiviteitenByBurgersLoader, GebruikersactiviteitenByIdLoader,
                                          GebruikersActiviteitenByHuishoudenLoader,
                                          GebruikersactiviteitenByBurgerLoader)
from .grootboekrekening_loader import GrootboekrekeningenByIdLoader
from .huishouden_loader import HuishoudenByIdLoader
from .journaalpost_loader import (
    JournaalpostByIdLoader,
    JournaalpostenByTransactionLoader,
    JournaalpostenByAfspraakLoader,
)
from .organisatie_loader import OrganisatieByIdLoader
from .overschrijving_loader import (OverschrijvingByAfspraakLoader, OverschrijvingByIdLoader)
from .postadressen_loader import PostadressenByIdLoader
from .rekeningen_loader import (RekeningenByBurgerLoader, RekeningByIbanLoader, RekeningByIdLoader,
                                RekeningenByAfdelingLoader)
from .rubrieken_loader import RubriekByGrootboekrekeningLoader, RubriekByIdLoader
from .signaal_loader import SignaalByIdLoader


class HHBDataLoader:
    """ Main Dataloader class for HHB """

    def __init__(self, loop: AbstractEventLoop):
        # Burgers
        self.burger_by_id = BurgerByIdLoader(loop=loop)
        self.burgers_by_huishouden = BurgersByHuishoudenLoader(loop=loop)

        # Organisaties
        self.organisatie_by_id = OrganisatieByIdLoader(loop=loop)

        # Afspraken
        self.afspraak_by_id = AfspraakByIdLoader(loop=loop)
        self.afspraken_by_burger = AfsprakenByBurgerLoader(loop=loop)
        self.afspraken_by_rekening = AfsprakenByRekeningLoader(loop=loop)
        self.afspraken_by_afdeling = AfsprakenByAfdelingLoader(loop=loop)
        self.afspraken_by_postadres = AfsprakenByPostadresLoader(loop=loop)

        # Rubrieken
        self.rubriek_by_id = RubriekByIdLoader(loop=loop)
        self.rubriek_by_grootboekrekening = RubriekByGrootboekrekeningLoader(
            loop=loop
        )

        # Overschrijvingen
        self.overschrijvingen_by_id = OverschrijvingByIdLoader(loop=loop)
        self.overschrijvingen_by_afspraak = OverschrijvingByAfspraakLoader(loop=loop)

        # Rekeningen
        self.rekening_by_id = RekeningByIdLoader(loop=loop)
        self.rekeningen_by_burger = RekeningenByBurgerLoader(loop=loop)
        self.rekeningen_by_afdeling = RekeningenByAfdelingLoader(loop=loop)
        self.rekening_by_iban = RekeningByIbanLoader(loop=loop)

        # Transaction Service
        self.csms_by_id = CSMsByIdLoader(loop=loop)
        self.bank_transaction_by_id = BankTransactionByIdLoader(loop=loop)
        self.bank_transactions_by_csm = BankTransactionByCsmLoader(loop=loop)
        self.bank_transactions_by_is_geboekt = BankTransactionByIsGeboektLoader(loop=loop)

        self.grootboekrekeningen_by_id = GrootboekrekeningenByIdLoader(loop=loop)
        self.journaalpost_by_id = JournaalpostByIdLoader(loop=loop)
        self.journaalposten_by_transaction = JournaalpostenByTransactionLoader(
            loop=loop
        )
        self.journaalposten_by_afspraak = JournaalpostenByAfspraakLoader(loop=loop)

        self.configuratie_by_id = ConfiguratieByIdLoader(loop=loop)

        # Exports
        self.export_by_id = ExportByIdLoader(loop=loop)

        self.gebruikersactiviteiten_by_id = GebruikersactiviteitenByIdLoader(loop=loop)
        self.gebruikersactiviteiten_by_burger = (GebruikersactiviteitenByBurgerLoader(loop=loop))
        self.gebruikersactiviteiten_by_burgers = (
            GebruikersactiviteitenByBurgersLoader(loop=loop)
        )
        self.gebruikersactiviteiten_by_afspraken = (
            GebruikersActiviteitenByAfsprakenLoader(loop=loop)
        )
        self.gebruikersactiviteiten_by_huishouden = (
            GebruikersActiviteitenByHuishoudenLoader(loop=loop)
        )

        # Huishoudens
        self.huishouden_by_id = HuishoudenByIdLoader(loop=loop)

        # Afdelingen
        self.afdeling_by_id = AfdelingenByIdLoader(loop=loop)
        self.afdelingen_by_organisatie = AfdelingenByOrganisatieLoader(loop=loop)

        # Postadressen
        self.postadres_by_id = PostadressenByIdLoader(loop=loop)

        # Alarmen
        self.alarmen = AlarmenLoader(loop=loop)
        self.alarm_by_id = AlarmByIdLoader(loop=loop)

        # Signalen
        self.signalen_by_id = SignaalByIdLoader(loop=loop)

    def __getitem__(self, item: str):
        return getattr(self, item)


def hhb_dataloader() -> HHBDataLoader:
    return request.dataloader
