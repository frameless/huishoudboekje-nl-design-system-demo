import datetime
import logging
from core_service.utils import row2dict
from bank_transactie_service.repositories.BanktransactionRepository import BanktransactionRepository


class BanktransactionRangeController():
    DATEFORMAT = '%Y-%m-%d'

    def get_banktransactions_in_range(self,ids, startDate, endDate):
        '''
            Returns banktransaction within the given range. 
            If ids are given it will select from those ids only, if no ids are given it selects from all transactions
        '''
        if not self.__valid_date_range(startDate,endDate):
            return "Invalid date range", 400
            
        repository = BanktransactionRepository()
        result_list = [row2dict(row) for row in repository.get_banktransactions_in_range(ids,startDate,endDate)]
        return {"data": result_list}, 200

    def __valid_date_range(self,startDate,endDate):
        '''Checks if both dates in the range are valid'''
        return self.__valid_date(startDate) and self.__valid_date(endDate) 

    def __valid_date(self,date):
        '''Checks if the date is valid with the set date format'''
        try:
            logging.info(date)
            datetime.datetime.strptime(date, self.DATEFORMAT)
            return True
        except:
            return False

