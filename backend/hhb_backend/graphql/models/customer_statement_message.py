import graphene
from flask import request
import hhb_backend.graphql.models.gebruiker as gebruiker
import hhb_backend.graphql.models.organisatie as organisatie
import hhb_backend.graphql.models.afspraak as afspraak

class CustomerStatementMessage(graphene.ObjectType):
    """GraphQL CustomerStatementMessage model"""
    id = graphene.Int()
    
    upload_date = graphene.DateTime()
    upload_datum = graphene.Date()
    def resolve_upload_datum(self):
        return self.upload_date
    
    transaction_reference_number = graphene.String()
    referentie_nummer =graphene.String()
    def resolve_referentie_nummer(self):
        return self.transaction_reference_number

    related_reference = graphene.String()
    gerelateerde_referentie = graphene.String()
    def resolve_gerelateerde_referentie(self):
        return self.related_reference

    account_identification = graphene.String()
    rekening_identificatie = graphene.String()
    def resolve_rekening_identificatie(self):
        return self.account_identification

    sequence_number = graphene.String()
    volg_nummer = graphene.String()
    def resolve_volg_nummer(self):
        return self.sequence_number

    opening_balance = graphene.Int()
    start_saldo = graphene.Int()
    def resolve_start_saldo(self):
        return self.opening_balance

    closing_balance = graphene.Int()
    eind_saldo = graphene.Int()
    def resolve_eind_saldo(self):
        return self.closing_balance

    closing_available_funds = graphene.Int()
    eind_beschikbaar_bedrag = graphene.Int()
    def resolve_eind_beschikbaar_bedrag(self):
        return self.closing_available_funds

    forward_available_balance = graphene.Int()
    vooruit_beschikbaar_saldo = graphene.Int()
    def resolve_vooruit_beschikbaar_saldo(self):
        return self.forward_available_balance

