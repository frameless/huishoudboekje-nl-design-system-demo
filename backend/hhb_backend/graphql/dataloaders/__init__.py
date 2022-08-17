# TODO unify naming, filenames are singular, loader names are plural

from flask import request

from .afdeling_loader import AfdelingByIdLoader, AfdelingenByOrganisatieLoader
from .afspraken_loader import AfsprakenByBurgerLoader, AfspraakByIdLoader, AfsprakenByRekeningLoader, \
    AfsprakenByAfdelingLoader, AfsprakenByPostadresLoader
from .alarm_loader import AlarmByIdLoader, AlarmLoader
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
from .grootboekrekening_loader import GrootboekrekeningByIdLoader
from .huishouden_loader import HuishoudenByIdLoader
from .journaalpost_loader import (
    JournaalpostByIdLoader,
    JournaalpostenByTransactionLoader,
    JournaalpostenByAfspraakLoader,
)
from .organisatie_loader import OrganisatieByIdLoader
from .overschrijving_loader import OverschrijvingenByAfspraakLoader, OverschrijvingByIdLoader
from .postadressen_loader import PostadressByIdLoader
from .rekeningen_loader import (RekeningenByBurgerLoader, RekeningByIbanLoader, RekeningByIdLoader,
                                RekeningenByAfdelingLoader)
from .rubrieken_loader import RubriekByGrootboekrekeningLoader, RubriekByIdLoader
from .signaal_loader import SignaalByIdLoader


class HHBDataLoader:
    """ Main Dataloader class for HHB """

    def __init__(self):
        # Burgers
        self.burger_by_id = BurgerByIdLoader()
        self.burgers_by_huishouden = BurgersByHuishoudenLoader()

        # Organisaties
        self.organisatie_by_id = OrganisatieByIdLoader()

        # Afspraken
        self.afspraak_by_id = AfspraakByIdLoader()
        self.afspraken_by_burger = AfsprakenByBurgerLoader()
        self.afspraken_by_rekening = AfsprakenByRekeningLoader()
        self.afspraken_by_afdeling = AfsprakenByAfdelingLoader()
        self.afspraken_by_postadres = AfsprakenByPostadresLoader()

        # Rubrieken
        self.rubriek_by_id = RubriekByIdLoader()
        self.rubriek_by_grootboekrekening = RubriekByGrootboekrekeningLoader()

        # Overschrijvingen
        self.overschrijving_by_id = OverschrijvingByIdLoader()
        self.overschrijvingen_by_afspraak = OverschrijvingenByAfspraakLoader()

        # Rekeningen
        self.rekening_by_id = RekeningByIdLoader()
        self.rekeningen_by_burger = RekeningenByBurgerLoader()
        self.rekeningen_by_afdeling = RekeningenByAfdelingLoader()
        self.rekening_by_iban = RekeningByIbanLoader()

        # Transaction Service
        self.csms_by_id = CSMsByIdLoader()
        self.bank_transaction_by_id = BankTransactionByIdLoader()
        self.bank_transactions_by_csm = BankTransactionByCsmLoader()
        self.bank_transactions_by_is_geboekt = BankTransactionByIsGeboektLoader()

        self.grootboekrekening_by_id = GrootboekrekeningByIdLoader()
        self.journaalpost_by_id = JournaalpostByIdLoader()
        self.journaalpost_by_transaction = JournaalpostenByTransactionLoader()
        self.journaalposten_by_afspraak = JournaalpostenByAfspraakLoader()

        self.configuratie_by_id = ConfiguratieByIdLoader()

        # Exports
        self.export_by_id = ExportByIdLoader()

        self.gebruikersactiviteit_by_id = GebruikersactiviteitenByIdLoader()
        self.gebruikersactiviteiten_by_burger = GebruikersactiviteitenByBurgerLoader()
        self.gebruikersactiviteiten_by_burgers = GebruikersactiviteitenByBurgersLoader()
        self.gebruikersactiviteiten_by_afspraken = GebruikersActiviteitenByAfsprakenLoader()
        self.gebruikersactiviteiten_by_huishouden = GebruikersActiviteitenByHuishoudenLoader()

        # Huishoudens
        self.huishouden_by_id = HuishoudenByIdLoader()

        # Afdelingen
        self.afdeling_by_id = AfdelingByIdLoader()
        self.afdelingen_by_organisatie = AfdelingenByOrganisatieLoader()

        # Postadressen
        self.postadres_by_id = PostadressByIdLoader()

        # Alarmen
        self.alarmen = AlarmLoader()
        self.alarm_by_id = AlarmByIdLoader()

        # Signalen
        self.signaal_by_id = SignaalByIdLoader()

    def __getitem__(self, item: str):
        return getattr(self, item)


def hhb_dataloader() -> HHBDataLoader:
    return request.dataloader
