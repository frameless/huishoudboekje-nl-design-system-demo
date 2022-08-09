""" Journaalpost model as used in GraphQL queries """
import graphene

import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.bank_transaction as bank_transaction
import hhb_backend.graphql.models.grootboekrekening as grootboekrekening
from hhb_backend.graphql.dataloaders import hhb_dataloader


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
            return hhb_dataloader().bank_transaction_by_id.load(root.get('transaction_id'))

    async def resolve_grootboekrekening(root, info):
        """ Get grootboekrekening when requested """
        if root.get('grootboekrekening_id'):
            return hhb_dataloader().grootboekrekeningen_by_id.load(root.get('grootboekrekening_id'))

    async def resolve_afspraak(root, info):
        """ Get afspraak when requested """
        if root.get('afspraak_id'):
            return hhb_dataloader().afspraak_by_id.load(root.get('afspraak_id'))
