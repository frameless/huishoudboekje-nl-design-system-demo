from models.bank_transaction import BankTransaction


class BanktransactionRepository():

    def get_banktransactions_in_range(self,ids,startDate,endDate):
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