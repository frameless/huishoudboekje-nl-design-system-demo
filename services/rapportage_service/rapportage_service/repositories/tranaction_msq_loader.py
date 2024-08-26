from datetime import datetime
import logging
from graphql import GraphQLError
from hhb_backend.graphql.dataloaders.msq_loaders.GetTransactionsMessage import GetTransactionsMessage, GetTransactionsPagedMessage, PaginationRequest, TransactionsFilter
from hhb_backend.graphql.dataloaders.msq_loaders.RPCClient import RpcClient
from hhb_backend.graphql.dataloaders.msq_loaders.settings import RABBBITMQ_PASS, RABBBITMQ_USER, RABBBITMQ_HOST, RABBBITMQ_PORT
from hhb_backend.graphql.dataloaders.request_object import GetRequestObject
from hhb_backend.service.model.bank_transaction import BankTransaction

class TransactionMsqLoader():

    def load_request(self, request: GetRequestObject) -> dict:
        """
        Loads the request object
        """
        date_format_input = '%Y-%m-%d'

        start = request.filter.get("start_date", None)
        end = request.filter.get("end_date", None)

        request_filter = TransactionsFilter(
            ids=request.filter.get("ids", None),
            ibans=request.filter.get("ibans", None),
            minAmount=request.filter.get("min_bedrag", None),
            maxAmount=request.filter.get("max_bedrag", None),
            startDate= int(datetime.strptime(start, date_format_input).timestamp()) if start is not None else None,
            endDate=int(datetime.strptime(end, date_format_input).timestamp()) if end is not None else None,
            isReconciled=request.filter.get("only_booked", None),
            isCredit=request.filter.get("only_credit", None),
            keyWords=request.filter.get("zoektermen", None),
        )
        take = request.params.get("limit", None)
        skip = request.params.get("offset", None)

        if take is not None and skip is not None:
            item = {
                "pagination" : {
                    "skip": skip,
                    "take": take
                },
                "filter": request_filter.to_dict()
            }

            rpc_client = RpcClient("get-transactions-paged")
            response = rpc_client.call(item)
            if response is None:
                return None
            pagedData = response.get("Data",None)
            if pagedData is None:
                data = []
            else:
                data = pagedData.get("Data",[])
        else:
            item = GetTransactionsMessage(
                filter=request_filter
            )

            rpc_client = RpcClient("get-transactions")
            response = rpc_client.call(item.to_dict())
            if response is None:
                return None
            data = response.get("Data",[])

        transaction_list = []
        for item in data:
            transaction_list.append({
                "uuid": item["UUID"],
                "bedrag": item["Amount"],
                "is_credit": item["IsCredit"],
                "is_geboekt": item["IsReconciled"],
                "tegen_rekening": item["FromAccount"],
                "transactie_datum": datetime.fromtimestamp(int(item["Date"])).strftime('%Y-%m-%d %H:%M:%S'),
                "information_to_account_owner": item["InformationToAccountOwner"],
            })
        result = {
            "banktransactions": transaction_list
        }
        if take is not None and skip is not None:
            result.update({
                "page_info": {
                    "count": pagedData.get("TotalCount", 0),
                    "limit": take,
                    "start": skip
                }
            })
        return result
    
    def by_csm(self, csm_id) -> dict:
        filter = TransactionsFilter(
            customerStatementMessageUuids=[csm_id]
        )
        return self.__get_transactions(filter)
    
    def by_is_geboekt(self, is_geboekt) -> dict:
        filter = TransactionsFilter(
            isReconciled=is_geboekt
        )
        return self.__get_transactions(filter)
    
    def load_one(self, uuid):
        filter = TransactionsFilter(
            ids=[uuid]
        )
        transaction = self.__get_transactions(filter)
        return transaction[0] if len(transaction) else None
    
    def load(self, transaction_ids) -> dict:
        filter = TransactionsFilter(
            ids=[transaction_ids] if type(transaction_ids) != list else transaction_ids
        )
        return self.__get_transactions(filter)

    def __get_transactions(self, filter: TransactionsFilter):
        item = GetTransactionsMessage(
            filter=filter
        )

        rpc_client = RpcClient("get-transactions")
        response = rpc_client.call(item.to_dict())
        if response is None:
                return None
        data = response.get("Data",[])

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
                BankTransaction(new_item)
            )
        return transaction_list
