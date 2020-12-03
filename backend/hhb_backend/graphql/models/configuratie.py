import graphene
from flask import request
import hhb_backend.graphql.models.bank_transaction as bank_transaction
import hhb_backend.graphql.models.grootboekrekening as grootboekrekening
import hhb_backend.graphql.models.afspraak as afspraak


class Configuratie(graphene.ObjectType):
    id = graphene.String()
    waarde = graphene.String()
