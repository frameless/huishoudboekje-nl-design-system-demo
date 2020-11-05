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
    def resolve_upload_date(root, info):
        value = root.get('upload_date')
        if value:
            return datetime.fromisoformat(value)

    upload_datum = graphene.DateTime()
    def resolve_upload_datum(root, info):
        value = root.get('upload_date')
        if value:
            return datetime.fromisoformat(value)
    
    transaction_reference_number = graphene.String()
    referentie_nummer =graphene.String()
    def resolve_referentie_nummer(root, info):
        return root.get("transaction_reference_number")

    related_reference = graphene.String()
    gerelateerde_referentie = graphene.String()
    def resolve_gerelateerde_referentie(root, info):
        return root.get("related_reference")

    account_identification = graphene.String()
    rekening_identificatie = graphene.String()
    def resolve_rekening_identificatie(root, info):
        return root.get("account_identification")

    sequence_number = graphene.String()
    volg_nummer = graphene.String()
    def resolve_volg_nummer(root, info):
        return root.get("sequence_number")

    opening_balance = graphene.Int()
    start_saldo = graphene.Int()
    def resolve_start_saldo(root, info):
        return root.get("opening_balance")

    closing_balance = graphene.Int()
    eind_saldo = graphene.Int()
    def resolve_eind_saldo(root, info):
        return root.get("closing_balance")

    closing_available_funds = graphene.Int()
    eind_beschikbaar_bedrag = graphene.Int()
    def resolve_eind_beschikbaar_bedrag(root, info):
        return root.get("closing_available_funds")

    forward_available_balance = graphene.Int()
    vooruit_beschikbaar_saldo = graphene.Int()
    def resolve_vooruit_beschikbaar_saldo(root, info):
        return root.get("forward_available_balance")

