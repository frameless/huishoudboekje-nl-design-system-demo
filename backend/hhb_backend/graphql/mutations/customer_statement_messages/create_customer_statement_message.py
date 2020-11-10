""" GraphQL mutation for creating a new CustomerStatementMessage """
import json
from datetime import datetime

import graphene
import requests
from graphene_file_upload.scalars import Upload
import mt940
from graphql import GraphQLError

from hhb_backend.graphql import settings


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
        csmServiceModel = {
            "upload_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "raw_data": content.decode("utf-8")}

        if 'transaction_reference' in csm_file.data and csm_file.data["transaction_reference"] is not None:
            csmServiceModel["transaction_reference_number"] = csm_file.data['transaction_reference']
        else:
            raise GraphQLError(f"Incorrect file, missing tag 20 transaction reference")

        # csmServiceModel.related_reference = csm_file.data['??']
        if 'account_identification' in csm_file.data and csm_file.data["account_identification"] is not None:
            csmServiceModel["account_identification"] = csm_file.data['account_identification']
        else:
            raise GraphQLError(f"Incorrect file, missing tag 25 account identification")

        if 'sequence_number' in csm_file.data and csm_file.data["sequence_number"] is not None:
            csmServiceModel["sequence_number"] = csm_file.data['sequence_number']

        if 'final_opening_balance' in csm_file.data and csm_file.data["final_opening_balance"] is not None:
            csmServiceModel["opening_balance"] = int(csm_file.data['final_opening_balance'].amount.amount * 100)

        if 'final_closing_balance' in csm_file.data and csm_file.data["final_closing_balance"] is not None:
            csmServiceModel["closing_balance"] = int(csm_file.data['final_closing_balance'].amount.amount * 100)

        if 'available_balance' in csm_file.data and csm_file.data["available_balance"] is not None:
            csmServiceModel["closing_available_funds"] = int(csm_file.data['available_balance'].amount.amount * 100)

        if 'forward_available_balance' in csm_file.data and csm_file.data["forward_available_balance"] is not None:
            csmServiceModel["forward_available_balance"] = int(
                csm_file.data['forward_available_balance'].amount.amount * 100)

        # Send the model
        org_service_response = requests.post(
            f"{settings.TRANSACTIE_SERVICES_URL}/customerstatementmessages/",
            data=json.dumps(csmServiceModel),
            headers={'Content-type': 'application/json'}
        )
        if org_service_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {org_service_response.json()}")

        # Add banktransactions
        # Post banktransactions

        return CreateCustomerStatementMessage(ok=True)
