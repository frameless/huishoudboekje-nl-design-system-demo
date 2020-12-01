import graphene

import hhb_backend.graphql.models.afspraak as afspraak
from hhb_backend.graphql.scalars.bedrag import Bedrag


class AfspraakInput(graphene.InputObjectType):
    gebruiker_id = graphene.Int()
    beschrijving = graphene.String()
    start_datum = graphene.String()
    eind_datum = graphene.String()
    aantal_betalingen = graphene.Int()
    interval = graphene.Argument(lambda: afspraak.IntervalInput)
    tegen_rekening_id = graphene.Int()
    bedrag = graphene.Argument(Bedrag)
    credit = graphene.Boolean()
    kenmerk = graphene.String()
    actief = graphene.Boolean()
    organisatie_id = graphene.Int()
    rubriek_id = graphene.Int()
    automatische_incasso = graphene.Boolean()
