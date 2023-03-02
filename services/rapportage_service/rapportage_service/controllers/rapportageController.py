import logging
from core_service.utils import valid_date_range
from decimal import Context, ROUND_HALF_DOWN
from decimal import Decimal
from injector import inject
from rapportage_service.repositories.banktransactieservice_repository import BanktransactieServiceRepository
from rapportage_service.repositories.huishoudboekjeservice_repository import HuishoudboekjeserviceRepository


class RapportageController():
    _hhb_repository: HuishoudboekjeserviceRepository
    _banktransactionservice_repository: BanktransactieServiceRepository

    REPORT_LINE_COLUMNS = ["tegen_rekening", "transactie_datum", "bedrag"]
    RUBRIEK = "rubriek"
    AMOUNT = "bedrag"
    TRANSACTION_Id = "transaction_id"
    ID = "id"


    @inject
    def __init__(self, hhb_repository: HuishoudboekjeserviceRepository, banktransactionservice_repository: BanktransactieServiceRepository) -> None:
        self._hhb_repository = hhb_repository
        self._banktransactionservice_repository = banktransactionservice_repository


    def get_rapportage_burger(self,burger_id, start, end):
        if not valid_date_range(start,end):
            return "Invalid date range", 400
        
        transactions_info = self._hhb_repository.get_transactions_burger(burger_id)

        if len(transactions_info) <= 0:
            '''No content'''
            return "No data found for burger", 204

        transaction_ids = [transaction[self.TRANSACTION_Id] for transaction in transactions_info]
        transactions_in_range = self._banktransactionservice_repository.get_transacties_in_range(start,end,transaction_ids)

        if len(transactions_in_range) <= 0:
            '''No content'''
            return "No data found in range", 204

        self.__transaform_transaction_amount(transactions_in_range)
        rapportage_transactions = self.__add_info_to_transactions_in_range(transactions_info, transactions_in_range)
        return {"data": self.__generate_rapportage(rapportage_transactions, start, end)}, 200
    

    def __add_info_to_transactions_in_range(self, transactions_info, transactions_in_range):
        return [transaction | self.__get_matching_transaction_info_with_transaction(transactions_info, transaction) for transaction in transactions_in_range]
    

    def __get_matching_transaction_info_with_transaction(self, transaction_info_list, transaction):
        return list(filter(lambda burger_transaction: burger_transaction[self.TRANSACTION_Id] == transaction[self.ID],transaction_info_list))[0]
    

    def __generate_rapportage(self, transactions, start, end):
        income = []
        expenses = []
        total_income = Decimal(0)
        total_expenses = Decimal(0)
        for transaction in transactions:
            amount = transaction[self.AMOUNT]
            if amount > 0:
                self.__add_transaction_to_list(income, transaction)
                total_income += amount
            else:
                self.__add_transaction_to_list(expenses, transaction)
                total_expenses += amount
        total = total_expenses + total_income
        return {"inkomsten": income,
                "uitgaven" : expenses,
                "totaalInkomsten": total_income,
                "totaalUitgaven": total_expenses,
                "startDatum": start,
                "eindDatum": end,
                "totaal": total }


    def __create_report_line_from_transaction(self, transaction):
        return {column : transaction[column] for column in self.REPORT_LINE_COLUMNS}
    
    
    def __transaform_transaction_amount(self, transactions_in_range):
        for transaction in transactions_in_range:
            transaction[self.AMOUNT] = self.__convert_value_into_decimal(transaction[self.AMOUNT])

    def __convert_value_into_decimal(self,value):
        return Decimal(value, Context(prec=2, rounding=ROUND_HALF_DOWN)) / 100
    
    def __add_transaction_to_list(self, report_rubriek_list, transaction):
        report_line = self.__create_report_line_from_transaction(transaction)
        rubriek_name = transaction[self.RUBRIEK]
        rubriek = next((report_rubriek for report_rubriek in report_rubriek_list if rubriek_name in report_rubriek), False)
        if not rubriek:
            report_rubriek_list.append({rubriek_name: [report_line]})
        else:
            rubriek[rubriek_name].append(report_line)
