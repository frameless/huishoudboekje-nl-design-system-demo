""" GraphQL mutation for creating a new Gebruiker/Burger """
import json

import graphene
import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker
import hhb_backend.graphql.mutations.rekening_input as rekening_input


class CreateGebruikerInput(graphene.InputObjectType):
    # gebruiker arguments
    email = graphene.String()
    geboortedatum = graphene.Date()
    telefoonnummer = graphene.String()
    rekeningen = graphene.List(lambda: rekening_input.RekeningInput)

    # burger arguments
    achternaam = graphene.String()
    huisnummer = graphene.String()
    postcode = graphene.String()
    straatnaam = graphene.String()
    voorletters = graphene.String()
    voornamen = graphene.String()
    plaatsnaam = graphene.String()


class CreateGebruiker(graphene.Mutation):
    class Arguments:
        input = graphene.Argument(CreateGebruikerInput)

    ok = graphene.Boolean()
    gebruiker = graphene.Field(lambda: Gebruiker)

    def mutate(root, info, **kwargs):
        """ Create the new Gebruiker/Burger """
        input = kwargs.pop("input")
        rekeningen = input.pop("rekeningen", None)
        gebruiker_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/gebruikers/",
            data=json.dumps(input, default=str),
            headers={'Content-type': 'application/json'}
        )
        if gebruiker_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {gebruiker_response.json()}")

        gebruiker = gebruiker_response.json()["data"]

        if rekeningen:
            gebruiker['rekeningen'] = []

            existing_rekeningen_response = requests.get(
                f"{settings.HHB_SERVICES_URL}/rekeningen/",
                params={"filter_ibans": ",".join(rekening['iban'] for rekening in rekeningen)},
                headers={'Content-type': 'application/json'}
            )
            if existing_rekeningen_response.status_code != 200:
                raise GraphQLError(f"Upstream API responded: {existing_rekeningen.json()}")
            existing_rekeningen = existing_rekeningen_response.json()['data']

            for rekening in rekeningen:
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
                    f"{settings.HHB_SERVICES_URL}/gebruikers/{gebruiker['id']}/rekeningen/",
                    data=json.dumps({"rekening_id": rekening_id}),
                    headers={'Content-type': 'application/json'}
                )
                if gebruiker_rekening_response.status_code != 201:
                    raise GraphQLError(f"Upstream API responded: {gebruiker_rekening_response.json()}")
                gebruiker['rekeningen'].append(rekening)

        return CreateGebruiker(gebruiker=gebruiker, ok=True)
