import json
import logging
from hhb_backend.graphql.dataloaders.msq_loaders.RPCClient import RpcClient
from graphql import GraphQLError
from hhb_backend.graphql.mutations.journaalposten.settings import RABBBITMQ_USER, RABBBITMQ_PASS,RABBBITMQ_HOST, RABBBITMQ_PORT
import pika
import requests
from typing import List, Union

from hhb_backend.graphql import settings
from hhb_backend.service.model.bank_transaction import BankTransaction


def update_transaction_service_is_geboekt(
    transactions: Union[List[BankTransaction], BankTransaction],
    is_geboekt: bool
):
    if type(transactions) is not list:
        transactions = [transactions]

    _transaction_ids = []
    for transaction in transactions:
        transaction.is_geboekt = is_geboekt
        _transaction_ids.append(str(transaction.uuid))

    update_transactions_geboekt(transactions, _transaction_ids, is_geboekt)


def update_transactions_geboekt(transactions: List[BankTransaction], _transaction_ids, is_geboekt):
    """ Sets the is_geboekt flag to true for all transactions """
    logging.debug(f"updating transactions is reconciled")

    # Create the log item
    item = {
        "Ids": _transaction_ids,
        "IsReconciled": is_geboekt
    }
    logging.debug(f"Sending transaction update to message broker...")


    rpc_client = RpcClient("update-is-reconciled")
    response = rpc_client.call(item)
    logging.debug(response)
    logging.debug(f"Ttransactions updated")
