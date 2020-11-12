""" GraphQL mutation for updating an Afspraak """
import graphene
from graphql import GraphQLError
import requests
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.afspraak import Afspraak, IntervalInput
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.utils import convert_hhb_interval_to_iso
import json

class UpdateAfspraak(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
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
        organisatie_id = graphene.Int()

    ok = graphene.Boolean()
    afspraak = graphene.Field(lambda: Afspraak)

    def mutate(root, info, **kwargs):
        """ Update the Afspraak """
        afspraak_id = kwargs.pop("id")
        if "interval" in kwargs:
            iso_interval = convert_hhb_interval_to_iso(kwargs["interval"])
            kwargs["interval"] = iso_interval
        post_response = requests.post(
            f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}",
            data=json.dumps(kwargs),
            headers={'Content-type': 'application/json'}
        )
        if not post_response.ok:
            raise GraphQLError(f"Upstream API responded: {post_response.json()}")
        return UpdateAfspraak(afspraak=post_response.json()["data"], ok=True)
