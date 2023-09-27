""" GraphQL mutation for creating a new CustomerStatementMessage """
from decimal import Decimal
import json
import logging
import re
from datetime import datetime

import graphene
import mt940
import requests

import hhb_backend.graphql.models.journaalpost as journaalpost
from graphql import GraphQLError
from hhb_backend.audit_logging import AuditLogging
from hhb_backend.camtParser import parser
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.customer_statement_message import (
    CustomerStatementMessage,
)
from hhb_backend.graphql.utils.gebruikersactiviteiten import GebruikersActiviteitEntity
from hhb_backend.processen import automatisch_boeken
from hhb_backend.service.model import customer_statement_message
from hhb_backend.service.model.bank_transaction import BankTransaction
from lib.graphene_file_upload.scalars import Upload

IBAN_REGEX = r"[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}"


class CreateCustomerStatementMessage(graphene.Mutation):
    class Arguments:
        file = Upload(required=True)

    ok = graphene.Boolean()
    customerStatementMessage = graphene.List(lambda: CustomerStatementMessage)
    journaalposten = graphene.List(lambda: journaalpost.Journaalpost)

    @staticmethod
    def mutate(self, info, file):
        logging.info(f"Creating csm")
        content = file.stream.read()

        if not content:
            raise GraphQLError("No content")
        else:
            try:
                raw = content.decode("utf-8")
            except:
                raise GraphQLError("File format not allowed.")

        if file.filename.lower().endswith('.xml'):
            csm_files = parser.CamtParser().parse(content)
        else:
            csm_files = [mt940.parse(content)]

        csm = []
        journaalposten = []

        for csm_file in csm_files:
            # Fill the csm model
            csm_model = customer_statement_message.CustomerStatementMessage(
                upload_date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                raw_data=raw,
                filename=file.filename
            )

            if not csm_file.data.get("transaction_reference"):
                raise GraphQLError(f"Incorrect file, missing tag 20 transaction reference or misplaced/missing Id tag")
            csm_model.transaction_reference_number = csm_file.data["transaction_reference"]

            # csmServiceModel.related_reference = csm_file.data['??']
            if not csm_file.data.get("account_identification"):
                raise GraphQLError(
                    f"Incorrect file, missing tag 25 account identification or misplaced/missing IBAN tag")
            csm_model.account_identification = csm_file.data["account_identification"]

            if csm_file.data.get("sequence_number"):
                csm_model.sequence_number = csm_file.data["sequence_number"]

            if csm_file.data.get("final_opening_balance"):
                csm_model.opening_balance = int(
                    csm_file.data["final_opening_balance"].amount.amount * 100
                )

            if csm_file.data.get("final_closing_balance"):
                csm_model.closing_balance = int(
                    csm_file.data["final_closing_balance"].amount.amount * 100
                )

            if csm_file.data.get("available_balance"):
                csm_model.closing_available_funds = int(
                    csm_file.data["available_balance"].amount.amount * 100
                )

            if csm_file.data.get("forward_available_balance"):
                csm_model.forward_available_balance = int(
                    csm_file.data["forward_available_balance"].amount.amount * 100
                )

            # Send the model
            post_response = requests.post(
                f"{settings.TRANSACTIE_SERVICES_URL}/customerstatementmessages/",
                data=json.dumps(csm_model),
                headers={"Content-type": "application/json"},
            )
            if post_response.status_code != 201:
                raise GraphQLError(f"Upstream API responded: {post_response.text}")

            created_csm = customer_statement_message.CustomerStatementMessage(post_response.json()["data"])

            if len(csm_file.transactions) == 0:
                raise GraphQLError("No transactions in file")

            created_csm.bank_transactions = process_transactions(created_csm.id, csm_file.transactions)

            csm.append(created_csm)

            # Try, if possible, to match banktransaction
            journaalpostentemp = automatisch_boeken.automatisch_boeken(created_csm.id)
            if journaalpostentemp:
                journaalposten.extend(journaalpostentemp)

        entities = []
        for csm_item in csm:
            for transaction in csm_item["bank_transactions"]:
                entities.append(
                    GebruikersActiviteitEntity(entityType="transaction", entityId=transaction["id"])
                )

        entities.extend([
            GebruikersActiviteitEntity(entityType="customerStatementMessage", entityId=item["id"])
            for item in csm
        ])

        AuditLogging.create(
            action=info.field_name,
            entities=entities,
            after=dict(customerStatementMessage=csm),
        )

        return CreateCustomerStatementMessage(
            journaalposten=journaalposten,
            customerStatementMessage=csm,
            ok=True
        )


def retrieve_iban(transaction_details: dict) -> str:
    if transaction_details.get('tegen_rekening', False):
        result = transaction_details['tegen_rekening']
    else:
        result = re.search(IBAN_REGEX, transaction_details['transaction_details'])
        if result is None:
            return ""
        else:
            result = result.group()
    return result


def process_transactions(csm_id, transactions):
    bank_transactions = []
    for t in transactions:
        transaction_model = BankTransaction(
            customer_statement_message_id=csm_id,
            information_to_account_owner=t.data["transaction_details"],
            statement_line=(
                t.data["date"].strftime("%y%m%d")
                + t.data["status"]
                + str(t.data["amount"].amount)
                + t.data["id"]
                + t.data["customer_reference"]
                + t.data["extra_details"]
            ),
            transactie_datum=str(t.data["date"].strftime("%Y-%m-%d")),
            tegen_rekening=retrieve_iban(t.data),
            is_credit=t.data["status"] == "C",
            bedrag=int(t.data["amount"].amount * 100)
        )

        bank_transactions.append(transaction_model)

    bank_transactions_response = requests.post(
        f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/",
        data=json.dumps(bank_transactions),
        headers={"Content-type": "application/json"},
    )
    if bank_transactions_response.status_code != 201:
        raise GraphQLError(
            f"Upstream API responded: {bank_transactions_response.text}"
        )
    return bank_transactions_response.json()["data"]
