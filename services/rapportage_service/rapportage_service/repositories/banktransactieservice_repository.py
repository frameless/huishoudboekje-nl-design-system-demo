from datetime import datetime
import logging

from rapportage_service.repositories.GetTransactionsMessage import GetTransactionsMessage, TransactionsFilter
from rapportage_service.repositories.RPCClient import RpcClient

# TODO When more services require this repository, this should be moved to the core service


class BanktransactieServiceRepository:
    date_format_input = '%Y-%m-%d'

    def get_transacties_in_range(self, startDate, endDate, transactions=[]):
        filter = TransactionsFilter(
            ids=transactions if transactions else None,
            startDate= int(datetime.strptime(startDate, self.date_format_input).timestamp()) if startDate is not None else None,
            endDate=int(datetime.strptime(endDate, self.date_format_input).timestamp()) if endDate is not None else None
        )
        return self.__get_transactions(filter)

    def get_saldo(self, date, transactions=None):
        filter = TransactionsFilter(
            ids=transactions if transactions else None,
            isReconciled=True,
            endDate=int(self.__get_end_of_date_timestamp(date)) if date is not None else None
        )
        data = self.__get_transactions(filter, map=False)
        saldo = 0
        for item in data:
            saldo = saldo + int(item["Amount"])
        return saldo

    def get_saldo_with_start_date(self, start, end, transactions=None):
        
        filter = TransactionsFilter(
            ids=transactions if transactions else None,
            isReconciled=True,
            startDate= int(self.__get_begin_of_date_timestamp(start)) if start is not None else None,
            endDate=int(self.__get_end_of_date_timestamp(end)) if end is not None else None,
        )
        data = self.__get_transactions(filter, map=False)
        saldo = 0
        for item in data:
            saldo = saldo + int(item["Amount"])
        return saldo

    def get_transactions_by_id(self, transaction_ids=[]):
        filter = TransactionsFilter(
            ids=transaction_ids if transaction_ids else None
        )
        return self.__get_transactions(filter)


    def __get_transactions(self, filter: TransactionsFilter, map=True):
        item = GetTransactionsMessage(
            filter=filter
        )

        rpc_client = RpcClient("get-transactions")
        response = rpc_client.call(item.to_dict())
        if response is None:
                return None
        data = response.get("Data",[])

        if not map:
            return data
        
        transaction_list = []
        
        for item in data:
            new_item = {
                "uuid": item["UUID"],
                "bedrag": item["Amount"],
                "is_credit": item["IsCredit"],
                "is_geboekt": item["IsReconciled"],
                "tegen_rekening": item["FromAccount"],
                "transactie_datum": datetime.fromtimestamp(int(item["Date"])).strftime('%Y-%m-%d %H:%M:%S'),
                "information_to_account_owner": item["InformationToAccountOwner"],
            }
            transaction_list.append(
                new_item
            )
        return transaction_list
    
    def __get_begin_of_date_timestamp(self, date):
        dateObject = datetime.strptime(date, self.date_format_input)
        return dateObject.timestamp()
    
    def __get_end_of_date_timestamp(self, date):
        dateObject = datetime.strptime(date, self.date_format_input)
        dateObject = dateObject.replace(hour=23, minute=59, second=59)
        return dateObject.timestamp()