import graphene

import hhb_backend.graphql.models.rekening as rekening


class Rekeningen(graphene.ObjectType):
    """ GraphQL Rekeningen model """
    gebruiker_id = graphene.Int()
    organisatie_id = graphene.Int()
    rekeningen = graphene.List(lambda: rekening.Rekening)
