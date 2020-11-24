""" BankTransaction model as used in GraphQL queries """
from datetime import date

import graphene
from flask import request
import hhb_backend.graphql.models.customer_statement_message as customer_statement_message_model
import hhb_backend.graphql.models.journaalpost as journaalpost
import hhb_backend.graphql.models.rekening as rekening
from hhb_backend.graphql.scalars.bedrag import Bedrag


class BankTransaction(graphene.ObjectType):
    """BankTransaction model"""
    id = graphene.Int()
    customer_statement_message = graphene.Field(lambda: customer_statement_message_model.CustomerStatementMessage)
    statement_line = graphene.String()
    information_to_account_owner = graphene.String()
    bedrag = graphene.Field(Bedrag)
    is_credit = graphene.Boolean()
    tegen_rekening = graphene.Field(lambda: rekening.Rekening)
    tegen_rekening_iban = graphene.String()
    transactie_datum = graphene.Date()

    journaalpost = graphene.Field(lambda: journaalpost.Journaalpost)

    def resolve_transactie_datum(root, info):
        value = root.get('transactie_datum')
        if value:
            return date.fromisoformat(value)

    def resolve_tegen_rekening_iban(root, info):
        tegen_rekening = root.get('tegen_rekening')
        if tegen_rekening:
            return tegen_rekening

    async def resolve_tegen_rekening(root, info):
        tegen_rekening = root.get('tegen_rekening')
        if tegen_rekening:
            return await request.dataloader.rekeningen_by_iban.load(tegen_rekening)


    async def resolve_journaalpost(root, info):
        return await request.dataloader.journaalposten_by_transaction.load(root.get('id'))

    async def resolve_customer_statement_message(root, info):
        """ Get customer_statement_message when requested """
        if root.get('customer_statement_message_id'):
            return await request.dataloader.csms_by_id.load(root.get('customer_statement_message_id'))
