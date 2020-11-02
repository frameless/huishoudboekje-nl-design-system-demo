""" GraphQL mutation for creating a new Afspraak """

import graphene
from graphql import GraphQLError
import requests
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.afspraak import Afspraak, IntervalInput
import hhb_backend.graphql.models.gebruiker as gebruiker
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.utils import convert_hhb_interval_to_iso
import json

class AddAfspraak(graphene.Mutation):
    class Arguments:
        gebruiker_id = graphene.Int()
        beschrijving = graphene.String()
        start_datum = graphene.Date()
        eind_datum = graphene.Date()
        aantal_betalingen = graphene.Int()
        interval = graphene.Argument(lambda: IntervalInput)
        tegen_rekening_id = graphene.Int()
        bedrag = graphene.Argument(Bedrag)
        credit = graphene.Boolean()
        kenmerk = graphene.String()
        actief = graphene.Boolean()

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: Afspraak)

    def mutate(root, info, **kwargs):
        """ Create the new Gebruiker/Burger """
        if "interval" in kwargs:
            iso_interval = convert_hhb_interval_to_iso(kwargs["interval"])
            if iso_interval:
                kwargs["interval"] = iso_interval
            else:
                kwargs.pop('interval')
        post_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afspraken/",
            data=json.dumps(kwargs, default=str),
            headers={'Content-type': 'application/json'}
        )
        if post_response.status_code != 201:
            raise GraphQLError(f"Upstream API responded: {post_response.json()}")
        return AddAfspraak(afspraak=post_response.json()["data"], ok=True)
