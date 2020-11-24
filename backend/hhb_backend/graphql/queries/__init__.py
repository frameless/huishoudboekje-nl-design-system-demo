""" GraphQL schema queries module """
import graphene

from .afspraken import AfspraakQuery, AfsprakenQuery
from .bank_transactions import BankTransactionQuery, BankTransactionsQuery
from .customer_statement_messages import CustomerStatementMessageQuery, CustomerStatementMessagesQuery
from .gebruikers import GebruikersQuery, GebruikerQuery
from .grootboekrekeningen import GrootboekrekeningQuery, GrootboekrekeningenQuery
from .journaalposten import JournaalpostQuery, JournaalpostenQuery
from .organisaties import OrganisatieQuery, OrganisatiesQuery
from .rekeningen import RekeningQuery, RekeningenQuery
from .rubrieken import RubriekQuery, RubriekenQuery

class RootQuery(graphene.ObjectType):
    """ The root of all queries """
    gebruiker = GebruikerQuery.return_type
    gebruikers = GebruikersQuery.return_type
    organisatie = OrganisatieQuery.return_type
    organisaties = OrganisatiesQuery.return_type
    afspraak = AfspraakQuery.return_type
    afspraken = AfsprakenQuery.return_type
    rekening = RekeningQuery.return_type
    rekeningen = RekeningenQuery.return_type
    customer_statement_message = CustomerStatementMessageQuery.return_type
    customer_statement_messages = CustomerStatementMessagesQuery.return_type
    bank_transaction = BankTransactionQuery.return_type
    bank_transactions = BankTransactionsQuery.return_type
    grootboekrekening = GrootboekrekeningQuery.return_type
    grootboekrekeningen = GrootboekrekeningenQuery.return_type
    journaalpost = JournaalpostQuery.return_type
    journaalposten = JournaalpostenQuery.return_type
    rubriek = RubriekQuery.return_type
    rubrieken = RubriekenQuery.return_type

    async def resolve_gebruiker(root, info, **kwargs):
        return await GebruikerQuery.resolver(root, info, **kwargs)

    async def resolve_gebruikers(root, info, **kwargs):
        return await GebruikersQuery.resolver(root, info, **kwargs)

    async def resolve_organisatie(root, info, **kwargs):
        return await OrganisatieQuery.resolver(root, info, **kwargs)

    async def resolve_organisaties(root, info, **kwargs):
        return await OrganisatiesQuery.resolver(root, info, **kwargs)

    async def resolve_afspraak(root, info, **kwargs):
        return await AfspraakQuery.resolver(root, info, **kwargs)

    async def resolve_afspraken(root, info, **kwargs):
        return await AfsprakenQuery.resolver(root, info, **kwargs)

    async def resolve_rekening(root, info, **kwargs):
        return await RekeningQuery.resolver(root, info, **kwargs)

    async def resolve_rekeningen(root, info, **kwargs):
        return await RekeningenQuery.resolver(root, info, **kwargs)

    async def resolve_customer_statement_message(root, info, **kwargs):
        return await CustomerStatementMessageQuery.resolver(root, info, **kwargs)

    async def resolve_customer_statement_messages(root, info, **kwargs):
        return await CustomerStatementMessagesQuery.resolver(root, info, **kwargs)

    async def resolve_bank_transaction(root, info, **kwargs):
        return await BankTransactionQuery.resolver(root, info, **kwargs)

    async def resolve_bank_transactions(root, info, **kwargs):
        return await BankTransactionsQuery.resolver(root, info, **kwargs)

    async def resolve_grootboekrekening(root, info, **kwargs):
        return await GrootboekrekeningQuery.resolver(root, info, **kwargs)

    async def resolve_grootboekrekeningen(root, info, **kwargs):
        return await GrootboekrekeningenQuery.resolver(root, info, **kwargs)

    async def resolve_journaalpost(root, info, **kwargs):
        return await JournaalpostQuery.resolver(root, info, **kwargs)

    async def resolve_journaalposten(root, info, **kwargs):
        return await JournaalpostenQuery.resolver(root, info, **kwargs)

    async def resolve_rubriek(root, info, **kwargs):
        return await RubriekQuery.resolver(root, info, **kwargs)

    async def resolve_rubrieken(root, info, **kwargs):
        return await RubriekenQuery.resolver(root, info, **kwargs)