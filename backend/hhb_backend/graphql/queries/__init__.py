""" GraphQL schema queries module """
import graphene
from .alarmen import AlarmenQuery, AlarmQuery
from .afspraken import AfspraakQuery, AfsprakenQuery
from .bank_transactions import BankTransactionQuery, BankTransactionsQuery, BankTransactionsPagedQuery
from .customer_statement_messages import CustomerStatementMessageQuery, CustomerStatementMessagesQuery
from .exports import ExportQuery, ExportsQuery
from .burgers import BurgersQuery, BurgerQuery, BurgersPagedQuery
from .grootboekrekeningen import GrootboekrekeningQuery, GrootboekrekeningenQuery
from .journaalposten import JournaalpostQuery, JournaalpostenQuery
from .organisaties import OrganisatieQuery, OrganisatiesQuery
from .rekeningen import RekeningQuery, RekeningenQuery
from .rubrieken import RubriekQuery, RubriekenQuery
from .configuraties import ConfiguratieQuery, ConfiguratiesQuery
from .gebruikersactiviteiten import GebruikersActiviteitQuery, GebruikersActiviteitenQuery, \
    GebruikersActiviteitenPagedQuery
from .gebruiker import GebruikerQuery
from .huishoudens import HuishoudenQuery, HuishoudensQuery, HuishoudensPagedQuery
from .afdelingen import AfdelingQuery, AfdelingenQuery
from .postadressen import PostadressenQuery, PostadresQuery


class RootQuery(graphene.ObjectType):
    """ The root of all queries """
    burger = BurgerQuery.return_type
    burgers = BurgersQuery.return_type
    burgers_paged = BurgersPagedQuery.return_type
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
    bank_transactions_paged = BankTransactionsPagedQuery.return_type
    grootboekrekening = GrootboekrekeningQuery.return_type
    grootboekrekeningen = GrootboekrekeningenQuery.return_type
    journaalpost = JournaalpostQuery.return_type
    journaalposten = JournaalpostenQuery.return_type
    rubriek = RubriekQuery.return_type
    rubrieken = RubriekenQuery.return_type
    configuratie = ConfiguratieQuery.return_type
    configuraties = ConfiguratiesQuery.return_type
    export = ExportQuery.return_type
    exports = ExportsQuery.return_type
    gebruikersactiviteit = GebruikersActiviteitQuery.return_type
    gebruikersactiviteiten = GebruikersActiviteitenQuery.return_type
    gebruikersactiviteiten_paged = GebruikersActiviteitenPagedQuery.return_type
    gebruiker = GebruikerQuery.return_type
    huishouden = HuishoudenQuery.return_type
    huishoudens = HuishoudensQuery.return_type
    huishoudens_paged = HuishoudensPagedQuery.return_type
    afdeling = AfdelingQuery.return_type
    afdelingen = AfdelingenQuery.return_type
    postadres = PostadresQuery.return_type
    postadressen = PostadressenQuery.return_type

    alarm = AlarmQuery.return_type
    alarmen = AlarmenQuery.return_type

    async def resolve_burger(root, info, **kwargs):
        return await BurgerQuery.resolver(root, info, **kwargs)

    async def resolve_burgers(root, info, **kwargs):
        return await BurgersQuery.resolver(root, info, **kwargs)

    async def resolve_burgers_paged(root, info, **kwargs):
        return await BurgersPagedQuery.resolver(root, info, **kwargs)

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

    async def resolve_bank_transactions_paged(root, info, **kwargs):
        return await BankTransactionsPagedQuery.resolver(root, info, **kwargs)

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

    async def resolve_configuratie(root, info, **kwargs):
        return await ConfiguratieQuery.resolver(root, info, **kwargs)

    async def resolve_configuraties(root, info, **kwargs):
        return await ConfiguratiesQuery.resolver(root, info, **kwargs)

    async def resolve_planned_overschrijvingen(root, info, **kwargs):
        return await PlannedOverschijvingenQuery.resolver(root, info, **kwargs)

    async def resolve_export(root, info, **kwargs):
        return await ExportQuery.resolver(root, info, **kwargs)

    async def resolve_exports(root, info, **kwargs):
        return await ExportsQuery.resolver(root, info, **kwargs)

    async def resolve_gebruikersactiviteit(root, info, **kwargs):
        return await GebruikersActiviteitQuery.resolver(root, info, **kwargs)

    async def resolve_gebruikersactiviteiten(root, info, **kwargs):
        return await GebruikersActiviteitenQuery.resolver(root, info, **kwargs)

    async def resolve_gebruikersactiviteiten_paged(root, info, **kwargs):
        return await GebruikersActiviteitenPagedQuery.resolver(root, info, **kwargs)

    async def resolve_huishouden(root, info, **kwargs):
        return await HuishoudenQuery.resolver(root, info, **kwargs)

    async def resolve_huishoudens(root, info, **kwargs):
        return await HuishoudensQuery.resolver(root, info, **kwargs)

    async def resolve_huishoudens_paged(root, info, **kwargs):
        return await HuishoudensPagedQuery.resolver(root, info, **kwargs)

    async def resolve_afdeling(root, info, **kwargs):
        return await AfdelingQuery.resolver(root, info, **kwargs)

    async def resolve_afdelingen(root, info, **kwargs):
        return await AfdelingenQuery.resolver(root, info, **kwargs)

    async def resolve_postadres(root, info, **kwargs):
        return await PostadresQuery.resolver(root, info, **kwargs)

    async def resolve_postadressen(root, info, **kwargs):
        return await PostadressenQuery.resolver(root, info, **kwargs)

    async def resolve_alarm(root, info, **kwargs):
        return await AlarmQuery.resolver(root, info, **kwargs)

    async def resolve_alarmen(root, info, **kwargs):
        return await AlarmenQuery.resolver(root, info, **kwargs)
        
    @staticmethod
    async def resolve_gebruiker(root, info, **kwargs):
        return GebruikerQuery.resolver(root, info, **kwargs)
