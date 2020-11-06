""" GraphQL mutation for creating a new CustomerStatementMessage """
import json
from datetime import datetime

import graphene
import requests
from graphene_file_upload.scalars import Upload
import mt940
from graphql import GraphQLError

from hhb_backend.graphql import settings


class CustomerStatementMessageServiceModel():
    upload_date = str
    raw_data = str
    # Tag 20
    transaction_reference_number = str
    # Tag 21
    related_reference = str
    # Tag 25
    account_identification = str
    # Tag 28C
    sequence_number = str
    # Tag 60f
    opening_balance = int
    # Tag 62f
    closing_balance = int
    # Tag 64
    closing_available_funds = int
    # Tag 65
    forward_available_balance = int


class CreateCustomerStatementMessage(graphene.Mutation):
    class Arguments:
        file = Upload(required=True)

    ok = graphene.Boolean()

    # TODO: CSM model returned

    def mutate(self, info, file, **kwargs):
        # do something with your file
        filename = file.filename
        content = file.stream.read()

        csm_file = mt940.parse(content)

        # Fill the csm model
        csmServiceModel = CustomerStatementMessageServiceModel()
        csmServiceModel.upload_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        csmServiceModel.raw_data = content
        csmServiceModel.transaction_reference_number = csm_file.data['transaction_reference']
        # csmServiceModel.related_reference = csm_file.data['??']
        csmServiceModel.account_identification = csm_file.data['account_identification']
        csmServiceModel.sequence_number = csm_file.data['sequence_number']
        csmServiceModel.opening_balance = int(csm_file.data['final_opening_balance'].amount.amount * 100)
        csmServiceModel.closing_balance = int(csm_file.data['final_closing_balance'].amount.amount * 100)
        csmServiceModel.closing_available_funds = int(csm_file.data['available_balance'].amount.amount * 100)
        csmServiceModel.forward_available_balance = int(csm_file.data['forward_available_balance'].amount.amount * 100)

        # Send the model
        org_service_response = requests.post(
            f"{settings.TRANSACTIE_SERVICES_URL}/transacties/",
            data=json.dumps(csmServiceModel.__dict__),
            headers={'Content-type': 'application/json'}
        )
        if org_service_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {org_service_response.json()}")

        return CreateCustomerStatementMessage(ok=True)
