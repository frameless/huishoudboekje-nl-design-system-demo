""" GraphQL mutation for creating a new CustomerStatementMessage """
import json
from datetime import datetime
import re

import graphene
import requests
from graphene_file_upload.scalars import Upload
import mt940
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.customer_statement_message import CustomerStatementMessage

IBAN_REGEX = r"[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}"


class CreateCustomerStatementMessage(graphene.Mutation):
    class Arguments:
        file = Upload(required=True)

    ok = graphene.Boolean()
    customerStatementMessage = graphene.Field(lambda: CustomerStatementMessage)

    def mutate(self, info, file, **kwargs):
        content = file.stream.read()
        csm_file = mt940.parse(content)
        # Fill the csm model
        csmServiceModel = {
            "upload_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "raw_data": content.decode("utf-8")}

        if csm_file.data.get('transaction_reference', False):
            csmServiceModel["transaction_reference_number"] = csm_file.data['transaction_reference']
        else:
            raise GraphQLError(f"Incorrect file, missing tag 20 transaction reference")

        # csmServiceModel.related_reference = csm_file.data['??']
        if csm_file.data.get('account_identification', False):
            csmServiceModel["account_identification"] = csm_file.data['account_identification']
        else:
            raise GraphQLError(f"Incorrect file, missing tag 25 account identification")

        if csm_file.data.get('sequence_number', False):
            csmServiceModel["sequence_number"] = csm_file.data['sequence_number']

        if csm_file.data.get('final_opening_balance', False):
            csmServiceModel["opening_balance"] = int(csm_file.data['final_opening_balance'].amount.amount * 100)

        if csm_file.data.get('final_closing_balance', False):
            csmServiceModel["closing_balance"] = int(csm_file.data['final_closing_balance'].amount.amount * 100)

        if csm_file.data.get('available_balance', False):
            csmServiceModel["closing_available_funds"] = int(csm_file.data['available_balance'].amount.amount * 100)

        if csm_file.data.get('forward_available_balance', False):
            csmServiceModel["forward_available_balance"] = int(
                csm_file.data['forward_available_balance'].amount.amount * 100)

        # Send the model
        post_response = requests.post(
            f"{settings.TRANSACTIE_SERVICES_URL}/customerstatementmessages/",
            data=json.dumps(csmServiceModel),
            headers={'Content-type': 'application/json'}
        )
        if post_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {post_response.json()}")

        csm_id = post_response.json()["data"]["id"]
        process_transactions(csm_id, csm_file.transactions)

        return CreateCustomerStatementMessage(customerStatementMessage=post_response.json()["data"], ok=True)


def retrieve_iban(transaction_details: str) -> str:
    result = re.search(IBAN_REGEX, transaction_details)
    if result is None:
        return ""
    return result.group()


def process_transactions(csm_id, transactions):
    for t in transactions:
        transactionModel = {}
        transactionModel["customer_statement_message_id"] = csm_id
        transactionModel["information_to_account_owner"] = t.data["transaction_details"]
        transactionModel["statement_line"] = t.data["date"].strftime("%y%m%d") + t.data["status"] + str(
            t.data["amount"].amount) + t.data["id"] + t.data["customer_reference"] + t.data["extra_details"]
        transactionModel["transactie_datum"] = str(t.data["date"])
        transactionModel["tegen_rekening"] = retrieve_iban(t.data["transaction_details"])
        transactionModel["is_credit"] = t.data["status"] == "C"
        transactionModel["bedrag"] = int(t.data["amount"].amount * 100)
        bank_transaction_response = requests.post(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/",
            data=json.dumps(transactionModel),
            headers={'Content-type': 'application/json'}
        )
        if bank_transaction_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {bank_transaction_response.json()}")