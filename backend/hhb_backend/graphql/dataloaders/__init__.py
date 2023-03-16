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

    def __getitem__(self, item: str):
        return getattr(self, item)


def hhb_dataloader() -> HHBDataLoader:
    return HHBDataLoader()
