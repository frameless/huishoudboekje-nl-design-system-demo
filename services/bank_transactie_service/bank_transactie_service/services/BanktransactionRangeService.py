import datetime

from models.bank_transaction import BankTransaction
from core_service.utils import row2dict


class BanktransactionRangeService():
    DATEFORMAT = '%Y-%m-%d'

    def get_banktransactions_in_range(self,ids, startDate, endDate):
        '''
            Returns banktransaction within the given range. 
            If ids are given it will select from those ids only, if no ids are given it selects from all transactions
        '''
        if not self.valid_date_range(startDate,endDate):
            return "Invalid date range", 400

        result_list = [row2dict(row) for row in self.get_banktransactions_from_database(ids,startDate,endDate)]

        return {"data": result_list}, 200
        
    
    def get_banktransactions_from_database(self,ids,startDate,endDate):
        '''
            Gets the banktransactions in the given range from the database. 
            If ids are given it will select from those ids only, if no ids are given it selects from all transactions
        '''
        if len(ids) > 0:
            result = BankTransaction.query\
                    .filter(BankTransaction.id.in_(ids))\
                    .filter(BankTransaction.transactie_datum.between(startDate,endDate))
        else :
            result = BankTransaction.query\
                    .filter(BankTransaction.transactie_datum.between(startDate,endDate))
        return result

    def valid_date_range(self,startDate,endDate):
        '''Checks if both dates in the range are valid'''
        return self.valid_date(startDate) and self.valid_date(endDate) 

    def valid_date(self,date):
        '''Checks if the date is valid with the set date format'''
        try:
            datetime.datetime.strptime(date, self.DATEFORMAT)
            return True
        except:
            return False

