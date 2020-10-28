""" GraphQL mutation for creating a new Rekening """
import json

import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.rekeningen import Rekeningen
from hhb_backend.graphql.mutations.rekening_input import RekeningInput


class CreateRekening(graphene.Mutation):
    class Arguments:
        gebruiker_id = graphene.Int()
        organisatie_id = graphene.Int()
        rekeningen = graphene.List(RekeningInput)

    ok = graphene.Boolean()
    rekeningen = graphene.Field(lambda: Rekeningen)

    def mutate(root, info, **kwargs):
        """ Create the new Rekeningen """
        rekeningen = []
        gebruiker_id = None
        organisatie_id = None
        if "rekeningen" in kwargs:
            rekeningen = kwargs.pop("rekeningen")
        if "gebruiker_id" in kwargs:
            gebruiker_id = kwargs.pop("gebruiker_id")
        if "organisatie_id" in kwargs:
            organisatie_id = kwargs.pop("organisatie_id")

        if (gebruiker_id is None and organisatie_id is None) or (
                gebruiker_id is not None and organisatie_id is not None):
            raise GraphQLError(f"Either gebruiker_id or organisatie_id has to be filled in.")

        rekeningen_model = Rekeningen
        rekeningen_model.gebruiker_id = gebruiker_id
        rekeningen_model.organisatie_id = organisatie_id
        rekeningen_list = []

        for rekening in rekeningen:
            rekening_response = requests.post(
                f"{settings.HHB_SERVICES_URL}/rekeningen/",
                data=json.dumps(rekening),
                headers={'Content-type': 'application/json'}
            )
            if rekening_response.status_code == 201:
                rekening = rekening_response.json()["data"]
                rekeningen_list.append(rekening)
                rekening_id = rekening_response.json()["data"]["id"]
                if gebruiker_id is not None:
                    response = requests.post(
                        f"{settings.HHB_SERVICES_URL}/gebruikers/{gebruiker_id}/rekeningen/",
                        data=json.dumps({"rekening_id": rekening_id}),
                        headers={'Content-type': 'application/json'}
                    )
                else:
                    response = requests.post(
                        f"{settings.HHB_SERVICES_URL}/organisaties/{organisatie_id}/rekeningen/",
                        data=json.dumps({"rekening_id": rekening_id}),
                        headers={'Content-type': 'application/json'}
                    )
                if response.status_code != 201:
                    raise GraphQLError(f"Upstream API responded: {response.json()}")
            else:
                raise GraphQLError(f"Upstream API responded: {rekening_response.json()}")

        rekeningen_model.rekeningen = rekeningen_list

        return CreateRekening(rekeningen=rekeningen_model, ok=True)
