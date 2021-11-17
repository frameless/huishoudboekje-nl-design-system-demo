""" Journaalpost model as used in GraphQL queries """
import graphene
from flask import request
import hhb_backend.graphql.models.bank_transaction as bank_transaction
import hhb_backend.graphql.models.grootboekrekening as grootboekrekening
import hhb_backend.graphql.models.afspraak as afspraak


class Journaalpost(graphene.ObjectType):
    """Model van een afgeletterde banktransactie."""
    id = graphene.Int()
    afspraak = graphene.Field(lambda: afspraak.Afspraak)
    transaction = graphene.Field(lambda: bank_transaction.BankTransaction)
    grootboekrekening = graphene.Field(lambda: grootboekrekening.Grootboekrekening)
    is_automatisch_geboekt = graphene.Boolean()

    async def resolve_transaction(root, info):
        """ Get transaction when requested """
        if root.get('transaction_id'):
            return await request.dataloader.bank_transactions_by_id.load(root.get('transaction_id'))

    async def resolve_grootboekrekening(root, info):
        """ Get grootboekrekening when requested """
        if root.get('grootboekrekening_id'):
            return await request.dataloader.grootboekrekeningen_by_id.load(root.get('grootboekrekening_id'))

    async def resolve_afspraak(root, info):
        """ Get afspraak when requested """
        if root.get('afspraak_id'):
            return await request.dataloader.afspraken_by_id.load(root.get('afspraak_id'))
