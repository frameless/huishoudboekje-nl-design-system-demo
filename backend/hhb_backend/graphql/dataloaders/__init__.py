from flask import request

from .afdeling_loader import AfdelingLoader
from .afspraak_loader import AfspraakLoader
from .alarm_loader import AlarmLoader
from .bank_transaction_loader import BankTransactionLoader
from .burger_loader import BurgerLoader
from .configuratie_loader import ConfiguratieLoader
from .csm_loader import CSMLoader
from .export_loader import ExportLoader
from .gebruikersactiviteit_loader import GebruikersactiviteitLoader
from .grootboekrekening_loader import GrootboekrekeningLoader
from .huishouden_loader import HuishoudenLoader
from .journaalpost_loader import JournaalpostLoader
from .transacties_journaalposten_rubriek_loader import JournaalpostRubriekLoader
from .organisatie_loader import OrganisatieLoader
from .overschrijving_loader import OverschrijvingLoader
from .postadres_loader import PostadresLoader
from .rekening_loader import RekeningLoader
from .rubriek_loader import RubriekLoader
from .signaal_loader import SignaalLoader
from .rapportage_loader import RapportageLoader
from .saldo_loader import SaldoLoader

from .afspraak_loader_concept import AfspraakLoaderConcept
from .transactie_loader_concept import TransactieLoaderConcept
from .journaalpost_loader_concept import JournaalpostLoaderConcept
from .overzicht_loader import OverzichtLoader

from .msq_loaders.tranaction_msq_loader import TransactionMsqLoader


class HHBDataLoader:
    """ Main Dataloader class for HHB """

    def __init__(self):
        self.afdelingen = AfdelingLoader()
        self.afspraken = AfspraakLoader()
        self.alarms = AlarmLoader()
        self.bank_transactions = BankTransactionLoader()
        self.burgers = BurgerLoader()
        self.configuraties = ConfiguratieLoader()
        self.csms = CSMLoader()
        self.exports = ExportLoader()
        self.gebruikersactiviteiten = GebruikersactiviteitLoader()
        self.grootboekrekeningen = GrootboekrekeningLoader()
        self.huishoudens = HuishoudenLoader()
        self.journaalposten = JournaalpostLoader()
        self.journaalposten_transactie_rubriek = JournaalpostRubriekLoader()
        self.postadressen = PostadresLoader()
        self.rekeningen = RekeningLoader()
        self.rubrieken = RubriekLoader()
        self.signalen = SignaalLoader()
        self.organisaties = OrganisatieLoader()
        self.overschrijvingen = OverschrijvingLoader()
        self.rapportage = RapportageLoader()
        self.saldo = SaldoLoader()
        self.overzicht = OverzichtLoader()

        self.afspraken_concept = AfspraakLoaderConcept()
        self.transacties_concept = TransactieLoaderConcept()
        self.journaalposten_concept = JournaalpostLoaderConcept()

        self.transactions_msq = TransactionMsqLoader()

    def __getitem__(self, item: str):
        return getattr(self, item)


def hhb_dataloader() -> HHBDataLoader:
    return HHBDataLoader()
