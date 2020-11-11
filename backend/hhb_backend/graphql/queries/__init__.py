""" GraphQL schema queries module """
import graphene
from .gebruikers import GebruikersQuery, GebruikerQuery
from .organisaties import OrganisatieQuery, OrganisatiesQuery
from .afspraken import AfspraakQuery, AfsprakenQuery
from .rekeningen import RekeningQuery, RekeningenQuery
from .customer_statement_messages import CustomerStatementMessageQuery, CustomerStatementMessagesQuery
from .bank_transactions import BankTransactionQuery, BankTransactionsQuery

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
