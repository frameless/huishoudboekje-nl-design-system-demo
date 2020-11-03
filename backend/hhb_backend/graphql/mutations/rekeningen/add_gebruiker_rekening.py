""" GraphQL mutation for creating a new Afspraak """

import graphene
from graphql import GraphQLError
import requests
from hhb_backend.graphql import settings
import json

import hhb_backend.graphql.models.rekening as rekening
import hhb_backend.graphql.mutations.rekening_input as rekening_input


class UpdateGebruikerRekeningen(graphene.Mutation):
    class Arguments:
        gebruiker_id = graphene.Int()
        rekeningen = graphene.List(lambda: rekening_input.RekeningInput)

    ok = graphene.Boolean()
    rekeningen = graphene.List(rekening.Rekening)


    def mutate(root, info, **kwargs):
        """ Create the new Rekening """
        gebruiker_id = kwargs.pop('gebruiker_id')
        rekeningen = kwargs.pop('rekeningen')
        result = []

        existing_rekeningen_response = requests.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/",
            params={"filter_ibans": ",".join(rekening['iban'] for rekening in rekeningen)},
            headers={'Content-type': 'application/json'}
        )
        if existing_rekeningen_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {existing_rekeningen.json()}")
        existing_rekeningen = existing_rekeningen_response.json()['data']

        for rekening in rekeningen:
            if rekening.get('id',  None) is not None:
                # TODO match on id and update when needed
                result.append(rekening)
                continue

            existing_rekening = next((r for r in existing_rekeningen if r['iban'] == rekening['iban']), None)
            if existing_rekening:
                rekening = existing_rekening
            else:
                rekening_response = requests.post(
                    f"{settings.HHB_SERVICES_URL}/rekeningen/",
                    data=json.dumps(rekening),
                    headers={'Content-type': 'application/json'}
                )
                if rekening_response.status_code != 201:
                    raise GraphQLError(f"Upstream API responded: {rekening_response.json()}")
                rekening = rekening_response.json()["data"]

            rekening_id = rekening["id"]
            gebruiker_rekening_response = requests.post(
                f"{settings.HHB_SERVICES_URL}/gebruikers/{gebruiker_id}/rekeningen/",
                data=json.dumps({"rekening_id": rekening_id}),
                headers={'Content-type': 'application/json'}
            )
            if gebruiker_rekening_response.status_code != 201:
                raise GraphQLError(f"Upstream API responded: {gebruiker_rekening_response.json()}")
            result.append(rekening)

        # TODO disconnect other rekeningen
        return UpdateGebruikerRekeningen(rekeningen=result, ok=True)
