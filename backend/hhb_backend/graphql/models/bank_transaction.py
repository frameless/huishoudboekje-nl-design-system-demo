""" BankTransaction model as used in GraphQL queries """
import graphene

import hhb_backend.graphql.models.afspraak as afspraak
import hhb_backend.graphql.models.customer_statement_message as customer_statement_message_model
import hhb_backend.graphql.models.journaalpost as journaalpost
import hhb_backend.graphql.models.rekening as rekening
from hhb_backend.graphql.dataloaders import hhb_dataloader
from hhb_backend.graphql.models.pageinfo import PageInfo
from hhb_backend.graphql.scalars.bedrag import Bedrag
from hhb_backend.graphql.utils.dates import to_date
from hhb_backend.processen import automatisch_boeken


class BankTransaction(graphene.ObjectType):
    id = graphene.Int()
    uuid = graphene.String()
    bedrag = graphene.Field(Bedrag)
    is_credit = graphene.Boolean()
    is_geboekt = graphene.Boolean()
    transactie_datum = graphene.Date()
    customer_statement_message = graphene.Field(lambda: customer_statement_message_model.CustomerStatementMessage)
    statement_line = graphene.String()
    information_to_account_owner = graphene.String()
    tegen_rekening_iban = graphene.String()
    tegen_rekening = graphene.Field(lambda: rekening.Rekening)
    journaalpost = graphene.Field(lambda: journaalpost.Journaalpost)
    suggesties = graphene.List(lambda: afspraak.Afspraak)

    def resolve_transactie_datum(root, info):
        value = root.get('transactie_datum')
        if value:
            return to_date(value)

    def resolve_tegen_rekening_iban(root, info):
        tegen_rekening = root.get('tegen_rekening')
        if tegen_rekening:
            return tegen_rekening

    def resolve_tegen_rekening(root, info):
        #This is (maybe) not necessary when batching is implemented
        #----
        if "rekening" in root:
            return root.get('rekening')
        #----
        tegen_rekening = root.get('tegen_rekening')
        if tegen_rekening:
            return hhb_dataloader().rekeningen.by_iban(tegen_rekening)

    def resolve_journaalpost(root, info):
        #This is (maybe) not necessary this way when batching is implemented
        journaalpost = root.get('journaalpost')
        if not journaalpost:
            result =  hhb_dataloader().journaalposten.by_transaction(root.get('uuid'))
        else:
            if journaalpost == -1:
                result = None
            else:
                result = journaalpost
        return result

    def resolve_customer_statement_message(root, info):
        """ Get customer_statement_message when requested """
        if root.get('customer_statement_message_id'):
            return hhb_dataloader().csms.load_one(root.get('customer_statement_message_id'))

    def resolve_suggesties(root, info):
        """ Get suggesties when requested """
        if root.get('is_geboekt'):
            return []
        
        suggesties = automatisch_boeken.transactie_suggesties(root.get("uuid"), exact_zoekterm_matches=False)
        return [item for sublist in suggesties.values() for item in sublist]


class BankTransactionsPaged(graphene.ObjectType):
    banktransactions = graphene.List(
        BankTransaction
    )
    page_info = graphene.Field(lambda: PageInfo)
