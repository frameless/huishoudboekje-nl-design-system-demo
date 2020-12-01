import graphene
from hhb_backend.graphql.
class Afspraak(graphene.ObjectType):
    id = graphene.Int()
    afspraak = graphene.Field(lambda: gebruiker.Gebruiker)
    exportBestand
    datum
    bedrag
    bankTransaction {
    ...BankTransaction
    } 
    status // (gereed | in behandeling | verwachting)
