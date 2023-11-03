from core_service.utils import valid_date_range, string_to_date, row2dict
from bank_transactie_service.repositories.BanktransactionRepository import BanktransactionRepository


class BanktransactionRangeController():

    def get_banktransactions_in_range(self,ids, startDate, endDate):
        '''
            Returns banktransaction within the given range. 
            If ids are given it will select from those ids only, if no ids are given it selects from all transactions
        '''
        if not valid_date_range(startDate,endDate):
            return "Invalid date range", 400
            
        repository = BanktransactionRepository()
        result_list = [row2dict(row) for row in repository.get_banktransactions_in_range(ids,string_to_date(startDate),string_to_date(endDate))]
        return {"data": result_list}, 200



