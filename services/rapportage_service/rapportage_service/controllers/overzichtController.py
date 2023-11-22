from core_service.utils import valid_date_range
from decimal import Context, ROUND_HALF_DOWN
from decimal import Decimal
from injector import inject
from rapportage_service.repositories.banktransactieservice_repository import BanktransactieServiceRepository
from rapportage_service.repositories.huishoudboekjeservice_repository import HuishoudboekjeserviceRepository


class RapportageController():
    _hhb_repository: HuishoudboekjeserviceRepository
    _banktransactionservice_repository: BanktransactieServiceRepository

    RUBRIEK = "rubriek"
    TRANSACTIES = "transacties"
    BURGER_ID = "burger_id"
    TEGENREKENING = "rekeninghouder"
    TRANSACTIE_DATUM = "transactie_datum"
    BEDRAG = "bedrag"
    REPORT_LINE_COLUMNS = [TEGENREKENING, TRANSACTIE_DATUM, BEDRAG]
    TRANSACTION_ID = "transaction_id"
    ID = "id"


    @inject
    def __init__(self, hhb_repository: HuishoudboekjeserviceRepository, banktransactionservice_repository: BanktransactieServiceRepository) -> None:
        self._hhb_repository = hhb_repository
        self._banktransactionservice_repository = banktransactionservice_repository


    def get_rapportage(self,burger_ids, filter_rubrieken, start, end):
        if not valid_date_range(start,end):
            return "Invalid date range", 400

        transactions_info = self._hhb_repository.get_transactions_burgers(burger_ids, filter_rubrieken)

