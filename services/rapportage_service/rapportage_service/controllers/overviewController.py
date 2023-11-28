import calendar
from datetime import datetime, timedelta
from decimal import ROUND_HALF_DOWN, Context, Decimal
import logging
from time import strptime
from core_service.utils import valid_date_range
from injector import inject
from rapportage_service.repositories.banktransactieservice_repository import BanktransactieServiceRepository
from rapportage_service.repositories.huishoudboekjeservice_repository import HuishoudboekjeserviceRepository
from rapportage_service.controllers.saldoController import SaldoController
import pandas as pd


class OverviewController():
    _hhb_repository: HuishoudboekjeserviceRepository
    _banktransactionservice_repository: BanktransactieServiceRepository

    @inject
    def __init__(self, hhb_repository: HuishoudboekjeserviceRepository, banktransactionservice_repository: BanktransactieServiceRepository) -> None:
        self._hhb_repository = hhb_repository
        self._banktransactionservice_repository = banktransactionservice_repository

    def get_saldos(self, burger_ids, date):

        transaction_ids = [transaction[self.TRANSACTION_ID]
                           for transaction in self._hhb_repository.get_transaction_ids_burgers(burger_ids)]

        return self.__get_saldo(date, transaction_ids)

    def get_overview(self, burger_ids, start, end):
        if not valid_date_range(start, end):
            return "Invalid date range", 400

        afspraken_info = self._hhb_repository.get_afspraken_with_transactions_in_period(
            burger_ids, start, end)
        transaction_ids = []
        afspraken_info = afspraken_info[0].get('afspraken', [])

        for afspraak in afspraken_info:
            transaction_ids.extend(afspraak['transaction_ids'])

        transactions_info = self._banktransactionservice_repository.get_transacties_in_range(
            start, end, transaction_ids)
        saldos = self.__get_saldos(start, end, transaction_ids)

        for afspraak in afspraken_info:
            transactions = []
            for transaction_id in afspraak['transaction_ids']:
                found_transaction = next(
                    (transaction for transaction in transactions_info if transaction["id"] == transaction_id), None)
                if found_transaction != None:
                    transactions.append(found_transaction)
            afspraak["transactions"] = transactions

        overzicht = {"afspraken": afspraken_info, "saldos": saldos}
        logging.warning(overzicht)
        return {"data": overzicht}, 200

    def __get_saldos(self, start, end, transaction_ids=None):
        dates = self.__get_start_and_end_of_months_per_daterange(start, end)
        saldos = []
        for date in dates:
            month_number = strptime(date['start'], "%Y-%m-%d").tm_mon
            saldos.append({'maandnummer': month_number, 'start_saldo': self.__convert_value_into_decimal(self._banktransactionservice_repository.get_saldo(
                date['start'], transaction_ids)), 'mutatie': self.__convert_value_into_decimal(self._banktransactionservice_repository.get_saldo_with_start_date(date['start'], date['end'], transaction_ids)),
                'eind_saldo': self.__convert_value_into_decimal(self._banktransactionservice_repository.get_saldo(date['end']))})
        return saldos

    def __get_start_and_end_of_months_per_daterange(self, start, end):
        months = pd.date_range(start, end,
                               freq='MS').strftime("%Y-%m-%d").tolist()
        dates = []
        for month in months:
            month_info = strptime(month, "%Y-%m-%d")
            year = month_info.tm_year
            month_number = month_info.tm_mon
            last_day = calendar.monthrange(year, month_number)[1]
            start_day = datetime.strptime(
                month, "%Y-%m-%d") - timedelta(days=1)
            dates.append(
                {'start': start_day.strftime('%Y-%m-%d'), 'end': f"{year}-{month_number}-{last_day}"})
        return dates

    def __convert_value_into_decimal(self, value):
        return Decimal(value, Context(prec=2, rounding=ROUND_HALF_DOWN)) / 100
