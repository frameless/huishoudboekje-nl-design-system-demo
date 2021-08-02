""" GraphQL mutation for creating a new CustomerStatementMessage """
import json
from datetime import datetime
import re

import graphene
import requests
from graphene_file_upload.scalars import Upload
import mt940
from graphql import GraphQLError
from hhb_backend.camtParser import parser

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.customer_statement_message import (
    CustomerStatementMessage,
)
from hhb_backend.graphql.utils.gebruikersactiviteiten import (
    gebruikers_activiteit_entities,
    log_gebruikers_activiteit,
)
import hhb_backend.graphql.models.journaalpost as journaalpost
from hhb_backend.processen import automatisch_boeken

IBAN_REGEX = r"[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}"


class CreateCustomerStatementMessage(graphene.Mutation):
    class Arguments:
        file = Upload(required=True)

    ok = graphene.Boolean()
    customerStatementMessage = graphene. List(lambda: CustomerStatementMessage)
    journaalposten = graphene.List(lambda: journaalpost.Journaalpost)

    def gebruikers_activiteit(self, _root, info, *_args, **_kwargs):
        return dict(
            action=info.field_name,
            entities=gebruikers_activiteit_entities(
                entity_type="customerStatementMessages",
                result=self,
                key="customerStatementMessages",
            )
            + gebruikers_activiteit_entities(
                entity_type="transaction",
                result=self.customerStatementMessage,
                key="bank_transactions",
            ),
            after=dict(customerStatementMessage=self.customerStatementMessage),
        )

    @staticmethod
    @log_gebruikers_activiteit
    async def mutate(_root, _info, file):
        content = file.stream.read()

        if file.filename.lower().endswith('.xml'):
            csm_files = parser.parse(content)
        else:
            csm_files = [mt940.parse(content)]


        customerStatementMessage = []
        journaalposten = []

        for csm_file in csm_files:
            # Fill the csm model
            csmServiceModel = {
                "upload_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "raw_data": content.decode("utf-8"),
                "filename": file.filename
            }

            if csm_file.data.get("transaction_reference", False):
                csmServiceModel["transaction_reference_number"] = csm_file.data[
                    "transaction_reference"
                ]
            else:
                raise GraphQLError(f"Incorrect file, missing tag 20 transaction reference or misplaced/missing Id tag")

            # csmServiceModel.related_reference = csm_file.data['??']
            if csm_file.data.get("account_identification", False):
                csmServiceModel["account_identification"] = csm_file.data[
                    "account_identification"
                ]
            else:
                raise GraphQLError(f"Incorrect file, missing tag 25 account identification or misplaced/missing IBAN tag")

            if csm_file.data.get("sequence_number", False):
                csmServiceModel["sequence_number"] = csm_file.data["sequence_number"]

            if csm_file.data.get("final_opening_balance", False):
                csmServiceModel["opening_balance"] = int(
                    csm_file.data["final_opening_balance"].amount.amount * 100
                )

            if csm_file.data.get("final_closing_balance", False):
                csmServiceModel["closing_balance"] = int(
                    csm_file.data["final_closing_balance"].amount.amount * 100
                )

            if csm_file.data.get("available_balance", False):
                csmServiceModel["closing_available_funds"] = int(
                    csm_file.data["available_balance"].amount.amount * 100
                )

            if csm_file.data.get("forward_available_balance", False):
                csmServiceModel["forward_available_balance"] = int(
                    csm_file.data["forward_available_balance"].amount.amount * 100
                )

            # Send the model
            post_response = requests.post(
                f"{settings.TRANSACTIE_SERVICES_URL}/customerstatementmessages/",
                data=json.dumps(csmServiceModel),
                headers={"Content-type": "application/json"},
            )
            if post_response.status_code != 201:
                raise GraphQLError(f"Upstream API responded: {post_response.text}")

            customerStatementMessagetemp = post_response.json()["data"]

            if len(csm_file.transactions) == 0:
                raise GraphQLError("No transactions in file")

            customerStatementMessagetemp["bank_transactions"] = process_transactions(
                customerStatementMessagetemp["id"], csm_file.transactions
            )

            customerStatementMessage.append(customerStatementMessagetemp)

            # Try, if possible, to match banktransaction
            journaalpostentemp = await automatisch_boeken.automatisch_boeken(customerStatementMessagetemp["id"])
            if journaalpostentemp:
                journaalposten.extend(journaalpostentemp)

        return CreateCustomerStatementMessage(
            journaalposten=journaalposten,
            customerStatementMessage=customerStatementMessage,
            ok=True
        )


def retrieve_iban(transaction_details: dict) -> str:
    if transaction_details.get('tegen_rekening',False):
        result = transaction_details['tegen_rekening']
    else:
        result = re.search(IBAN_REGEX, transaction_details['transaction_details'])
        if result is None:
            return ""
        else:
            result = result.group()
    return result


def process_transactions(csm_id, transactions):
    # TODO when the performance of this becomes a problem, convert to batch: transform all the transactions to a json
    # array and post them with one call.
    result = []
    for t in transactions:
        transactionModel = {}
        transactionModel["customer_statement_message_id"] = csm_id
        transactionModel["information_to_account_owner"] = t.data["transaction_details"]
        transactionModel["statement_line"] = (
            t.data["date"].strftime("%y%m%d")
            + t.data["status"]
            + str(t.data["amount"].amount)
            + t.data["id"]
            + t.data["customer_reference"]
            + t.data["extra_details"]
        )
        transactionModel["transactie_datum"] = str(t.data["date"].strftime("%Y-%m-%d"))
        transactionModel["tegen_rekening"] = retrieve_iban(
            t.data
        )
        transactionModel["is_credit"] = t.data["status"] == "C"
        transactionModel["bedrag"] = int(t.data["amount"].amount * 100)
        bank_transaction_response = requests.post(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/",
            data=json.dumps(transactionModel),
            headers={"Content-type": "application/json"},
        )
        if bank_transaction_response.status_code != 201:
            raise GraphQLError(
                f"Upstream API responded: {bank_transaction_response.text}"
            )
        bank_transaction = bank_transaction_response.json()["data"]
        result.append(bank_transaction["id"])

    return result
