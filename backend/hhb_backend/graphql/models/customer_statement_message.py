from datetime import datetime
import graphene
from flask import request
import hhb_backend.graphql.models.gebruiker as gebruiker
import hhb_backend.graphql.models.organisatie as organisatie
import hhb_backend.graphql.models.afspraak as afspraak

class CustomerStatementMessage(graphene.ObjectType):
    """GraphQL CustomerStatementMessage model"""
    id = graphene.Int()
    upload_date = graphene.DateTime()
    transaction_reference_number = graphene.String()
    related_reference = graphene.String()
    account_identification = graphene.String()
    sequence_number = graphene.String()
    opening_balance = graphene.Int()
    closing_balance = graphene.Int()
    closing_available_funds = graphene.Int()
    forward_available_balance = graphene.Int()

    def resolve_upload_date(root, info):
        value = root.get('upload_date')
        if value:
            return datetime.fromisoformat(value)
