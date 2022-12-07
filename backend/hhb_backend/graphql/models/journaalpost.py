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

    def resolve_transaction(root, info):
        """ Get transaction when requested """
        if root.get('transaction_id'):
            return hhb_dataloader().bank_transactions.load_one(root.get('transaction_id'))

    def resolve_grootboekrekening(root, info):
        """ Get grootboekrekening when requested """
        if root.get('grootboekrekening_id'):
            return hhb_dataloader().grootboekrekeningen.load_one(root.get('grootboekrekening_id'))

    def resolve_afspraak(root, info):
        """ Get afspraak when requested """
        if root.get('afspraak_id'):
            return hhb_dataloader().afspraken.load_one(root.get('afspraak_id'))
