from core_service.utils import valid_date_range
from injector import inject
from rapportage_service.repositories.banktransactieservice_repository import BanktransactieServiceRepository
from rapportage_service.repositories.huishoudboekjeservice_repository import HuishoudboekjeserviceRepository


class RapportageController():
    _hhb_repository: HuishoudboekjeserviceRepository
    _banktransactionservice_repository: BanktransactieServiceRepository

    REPORT_LINE_COLUMNS = ["tegen_rekening", "transactie_datum", "bedrag"]
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
        transaction_ids = [transaction[self.TRANSACTION_Id] for transaction in transactions_info]
        transactions_in_range = self._banktransactionservice_repository.get_transacties_in_range(start,end,transaction_ids)
        rapportage_transactions = self.__add_info_to_transactions_in_range(transactions_info, transactions_in_range)
        return {"data": self.__generate_rapportage(rapportage_transactions, start, end)}, 200
    
    def __add_info_to_transactions_in_range(self, transactions_info, transactions_in_range):
        return [transaction | self.__matching_transaction_info_with_transaction(transactions_info, transaction) for transaction in transactions_in_range]
    
    def __matching_transaction_info_with_transaction(self, transaction_info_list, transaction):
        return list(filter(lambda burger_transaction: burger_transaction[self.TRANSACTION_Id] == transaction[self.ID],transaction_info_list))[0]
    
    def __generate_rapportage(self, transactions, start, end):
        income = []
        expenses = []
        total_income = 0
        total_expenses = 0
        for transaction in transactions:
            report_line = self.__create_report_line_from_transaction(transaction)
            amount = transaction[self.AMOUNT]
            if amount > 0:
                income.append(report_line)
                total_income += amount
            else:
                expenses.append(report_line)
                total_expenses += amount
        total = total_income - total_expenses
        return {"inkomsten": income,
                "uitgaven" : expenses,
                "totaalInkomsten": total_income,
                "totaalUitgaven": total_expenses,
                "startDatum": start,
                "eindDatum": end,
                "totaal": total }


    def __create_report_line_from_transaction(self, transaction):
        return {column : transaction[column] for column in self.REPORT_LINE_COLUMNS}

