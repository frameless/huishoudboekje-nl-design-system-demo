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
    ID = "uuid"


    @inject
    def __init__(self, hhb_repository: HuishoudboekjeserviceRepository, banktransactionservice_repository: BanktransactieServiceRepository) -> None:
        self._hhb_repository = hhb_repository
        self._banktransactionservice_repository = banktransactionservice_repository


    def get_rapportage(self,burger_ids, filter_rubrieken, start, end):
        if not valid_date_range(start,end):
            return "Invalid date range", 400
        
        transactions_info = self._hhb_repository.get_transactions_burgers(burger_ids, filter_rubrieken)

        if not self.__correct_structure_requested_data(transactions_info, [self.BURGER_ID, self.TEGENREKENING, self.TRANSACTION_ID, self.RUBRIEK]):
            '''Not found'''
            return "No data found for burger", 204

        transaction_ids = [transaction[self.TRANSACTION_ID] for transaction in transactions_info]
        transactions_in_range = self._banktransactionservice_repository.get_transacties_in_range(start,end,transaction_ids)

        if not self.__correct_structure_requested_data(transactions_in_range, [self.TRANSACTIE_DATUM, self.BEDRAG]):
            '''Not found'''
            return "No data found in range", 204

        self.__transaform_transaction_amount(transactions_in_range)
        rapportage_transactions = self.__add_info_to_transactions_in_range(transactions_info, transactions_in_range)
        if len(burger_ids) > 0:
            rapportages = [self.__generate_rapportage(burger_id, \
                                        list(filter(lambda transaction: transaction[self.BURGER_ID] == burger_id, rapportage_transactions)),\
                                        start,\
                                        end)\
                                for burger_id in burger_ids
                        ]
        else:
            rapportages = [self.__generate_rapportage(None, \
                                        rapportage_transactions,\
                                        start,\
                                        end)\
                        ]

        
        return {"data": rapportages}, 200
    

    def __add_info_to_transactions_in_range(self, transactions_info, transactions_in_range):
        return [transaction | self.__get_matching_transaction_info_with_transaction(transactions_info, transaction) for transaction in transactions_in_range]
    

    def __get_matching_transaction_info_with_transaction(self, transaction_info_list, transaction):
        return list(filter(lambda burger_transaction: burger_transaction[self.TRANSACTION_ID] == transaction[self.ID],transaction_info_list))[0]
    

    def __generate_rapportage(self, burger_id, transactions, start, end):
        income = []
        expenses = []
        total_income = Decimal(0)
        total_expenses = Decimal(0)
        for transaction in transactions:
            amount = transaction[self.BEDRAG]
            if amount > 0:
                self.__add_transaction_to_list(income, transaction)
                total_income += amount
            else:
                self.__add_transaction_to_list(expenses, transaction)
                total_expenses += amount
        total = total_expenses + total_income
        return {"burger_id": burger_id,
                "inkomsten": income,
                "uitgaven" : expenses,
                "totaal_inkomsten": total_income,
                "totaal_uitgaven": total_expenses,
                "start_datum": start,
                "eind_datum": end,
                "totaal": total }


    def __create_report_line_from_transaction(self, transaction):
        return {column : transaction[column] for column in self.REPORT_LINE_COLUMNS}
    
    
    def __transaform_transaction_amount(self, transactions_in_range):
        for transaction in transactions_in_range:
            transaction[self.BEDRAG] = self.__convert_value_into_decimal(transaction[self.BEDRAG])


    def __convert_value_into_decimal(self,value):
        return Decimal(value, Context(prec=2, rounding=ROUND_HALF_DOWN)) / 100
    

    def __add_transaction_to_list(self, report_rubriek_list, transaction):
        report_line = self.__create_report_line_from_transaction(transaction)
        rubriek_name = transaction[self.RUBRIEK]
        rubriek = next((report_rubriek for report_rubriek in report_rubriek_list if report_rubriek.get(self.RUBRIEK, "") == rubriek_name), False)
        if not rubriek:
            report_rubriek_list.append({self.RUBRIEK:rubriek_name, self.TRANSACTIES: [report_line] })
        else:
            rubriek[self.TRANSACTIES].append(report_line)

    def __correct_structure_requested_data(self, list, dict_keys):
        return len(list) > 0 \
            and type(list[0]) is dict \
            and all(key in list[0] for key in dict_keys)