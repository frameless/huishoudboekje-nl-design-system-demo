""" GraphQL schema queries module """
import graphene

from .afdelingen import AfdelingQuery, AfdelingenByIbanQuery, AfdelingenQuery
from .afspraken import AfspraakQuery, SearchAfsprakenQuery, AfsprakenQuery
from .alarmen import AlarmenQuery, AlarmQuery
from .bank_transactions import BankTransactionQuery, BankTransactionsQuery, BankTransactionsPagedQuery, BankTransactionsSearchQuery
from .burgers import BurgersQuery, BurgerQuery, BurgersPagedQuery
from .configuraties import ConfiguratieQuery, ConfiguratiesQuery
from .customer_statement_messages import CustomerStatementMessageQuery, CustomerStatementMessagesQuery
from .exports import ExportQuery, ExportsQuery
from .gebruikersactiviteiten import GebruikersActiviteitQuery, GebruikersActiviteitenQuery, \
    GebruikersActiviteitenPagedQuery
from .grootboekrekeningen import GrootboekrekeningQuery, GrootboekrekeningenQuery
from .huishoudens import HuishoudenQuery, HuishoudensQuery, HuishoudensPagedQuery
from .journaalposten import JournaalpostQuery, JournaalpostenTransactionRubriekQuery, JournaalpostenQuery
from .organisaties import OrganisatieQuery, OrganisatiesQuery
from .postadressen import PostadressenQuery, PostadresQuery
from .rekeningen import RekeningQuery, RekeningenByIbansQuery, RekeningenQuery
from .rubrieken import RubriekQuery, RubriekenQuery
from .saldo import SaldoQuery
from .signalen import SignaalQuery, SignalenQuery
from .rapportages import BurgerRapportagesQuery
from .overzicht import OverzichtQuery


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
    rekeningen_by_ibans = RekeningenByIbansQuery.return_type
    customer_statement_message = CustomerStatementMessageQuery.return_type
    customer_statement_messages = CustomerStatementMessagesQuery.return_type
    bank_transaction = BankTransactionQuery.return_type
    bank_transactions = BankTransactionsQuery.return_type
    bank_transactions_paged = BankTransactionsPagedQuery.return_type
    grootboekrekening = GrootboekrekeningQuery.return_type
    grootboekrekeningen = GrootboekrekeningenQuery.return_type
    journaalpost = JournaalpostQuery.return_type
    journaalposten = JournaalpostenQuery.return_type
    journaalposten_transactie_rubriek = JournaalpostenTransactionRubriekQuery.return_type
    rubriek = RubriekQuery.return_type
    rubrieken = RubriekenQuery.return_type
    configuratie = ConfiguratieQuery.return_type
    configuraties = ConfiguratiesQuery.return_type
    export = ExportQuery.return_type
    exports = ExportsQuery.return_type
    gebruikersactiviteit = GebruikersActiviteitQuery.return_type
    gebruikersactiviteiten = GebruikersActiviteitenQuery.return_type
    gebruikersactiviteiten_paged = GebruikersActiviteitenPagedQuery.return_type
    huishouden = HuishoudenQuery.return_type
    huishoudens = HuishoudensQuery.return_type
    huishoudens_paged = HuishoudensPagedQuery.return_type
    afdeling = AfdelingQuery.return_type
    afdelingen = AfdelingenQuery.return_type
    afdelingen_by_iban = AfdelingenByIbanQuery.return_type
    postadres = PostadresQuery.return_type
    postadressen = PostadressenQuery.return_type
    saldo = SaldoQuery.return_type
    alarm = AlarmQuery.return_type
    alarmen = AlarmenQuery.return_type
    signaal = SignaalQuery.return_type
    signalen = SignalenQuery.return_type
    burger_rapportages = BurgerRapportagesQuery.return_type
    search_afspraken = SearchAfsprakenQuery.return_type
    search_transacties = BankTransactionsSearchQuery.return_type
    overzicht = OverzichtQuery.return_type

    def resolve_burger(root, info, **kwargs):
        return BurgerQuery.resolver(root, info, **kwargs)

    def resolve_burgers(root, info, **kwargs):
        return BurgersQuery.resolver(root, info, **kwargs)

    def resolve_burgers_paged(root, info, **kwargs):
        return BurgersPagedQuery.resolver(root, info, **kwargs)

    def resolve_organisatie(root, info, **kwargs):
        return OrganisatieQuery.resolver(root, info, **kwargs)

    def resolve_organisaties(root, info, **kwargs):
        return OrganisatiesQuery.resolver(root, info, **kwargs)

    def resolve_afspraak(root, info, **kwargs):
        return AfspraakQuery.resolver(root, info, **kwargs)

    def resolve_afspraken(root, info, **kwargs):
        return AfsprakenQuery.resolver(root, info, **kwargs)

    def resolve_rekening(root, info, **kwargs):
        return RekeningQuery.resolver(root, info, **kwargs)

    def resolve_rekeningen(root, info, **kwargs):
        return RekeningenQuery.resolver(root, info, **kwargs)

    def resolve_rekeningen_by_ibans(root, info, **kwargs):
        return RekeningenByIbansQuery.resolver(root, info, **kwargs)

    def resolve_customer_statement_message(root, info, **kwargs):
        return CustomerStatementMessageQuery.resolver(root, info, **kwargs)

    def resolve_customer_statement_messages(root, info, **kwargs):
        return CustomerStatementMessagesQuery.resolver(root, info, **kwargs)

    def resolve_bank_transaction(root, info, **kwargs):
        return BankTransactionQuery.resolver(root, info, **kwargs)

    def resolve_bank_transactions(root, info, **kwargs):
        return BankTransactionsQuery.resolver(root, info, **kwargs)

    def resolve_bank_transactions_paged(root, info, **kwargs):
        return BankTransactionsPagedQuery.resolver(root, info, **kwargs)

    def resolve_grootboekrekening(root, info, **kwargs):
        return GrootboekrekeningQuery.resolver(root, info, **kwargs)

    def resolve_grootboekrekeningen(root, info, **kwargs):
        return GrootboekrekeningenQuery.resolver(root, info, **kwargs)

    def resolve_journaalpost(root, info, **kwargs):
        return JournaalpostQuery.resolver(root, info, **kwargs)

    def resolve_journaalposten(root, info, **kwargs):
        return JournaalpostenQuery.resolver(root, info, **kwargs)

    def resolve_journaalposten_transactie_rubriek(root, info, **kwargs):
        return JournaalpostenTransactionRubriekQuery.resolver(root, info, **kwargs)

    def resolve_rubriek(root, info, **kwargs):
        return RubriekQuery.resolver(root, info, **kwargs)

    def resolve_rubrieken(root, info, **kwargs):
        return RubriekenQuery.resolver(root, info, **kwargs)

    def resolve_configuratie(root, info, **kwargs):
        return ConfiguratieQuery.resolver(root, info, **kwargs)

    def resolve_configuraties(root, info, **kwargs):
        return ConfiguratiesQuery.resolver(root, info, **kwargs)

    def resolve_planned_overschrijvingen(root, info, **kwargs):
        return PlannedOverschijvingenQuery.resolver(root, info, **kwargs)

    def resolve_export(root, info, **kwargs):
        return ExportQuery.resolver(root, info, **kwargs)

    def resolve_exports(root, info, **kwargs):
        return ExportsQuery.resolver(root, info, **kwargs)

    def resolve_gebruikersactiviteit(root, info, **kwargs):
        return GebruikersActiviteitQuery.resolver(root, info, **kwargs)

    def resolve_gebruikersactiviteiten(root, info, **kwargs):
        return GebruikersActiviteitenQuery.resolver(root, info, **kwargs)

    def resolve_gebruikersactiviteiten_paged(root, info, **kwargs):
        return GebruikersActiviteitenPagedQuery.resolver(root, info, **kwargs)

    def resolve_huishouden(root, info, **kwargs):
        return HuishoudenQuery.resolver(root, info, **kwargs)

    def resolve_huishoudens(root, info, **kwargs):
        return HuishoudensQuery.resolver(root, info, **kwargs)

    def resolve_huishoudens_paged(root, info, **kwargs):
        return HuishoudensPagedQuery.resolver(root, info, **kwargs)

    def resolve_afdeling(root, info, **kwargs):
        return AfdelingQuery.resolver(root, info, **kwargs)

    def resolve_afdelingen(root, info, **kwargs):
        return AfdelingenQuery.resolver(root, info, **kwargs)

    def resolve_afdelingen_by_iban(root, info, **kwargs):
        return AfdelingenByIbanQuery.resolver(root, info, **kwargs)

    def resolve_postadres(root, info, **kwargs):
        return PostadresQuery.resolver(root, info, **kwargs)

    def resolve_postadressen(root, info, **kwargs):
        return PostadressenQuery.resolver(root, info, **kwargs)

    def resolve_alarm(root, info, **kwargs):
        return AlarmQuery.resolver(root, info, **kwargs)

    def resolve_alarmen(root, info, **kwargs):
        return AlarmenQuery.resolver(root, info, **kwargs)

    def resolve_signaal(root, info, **kwargs):
        return SignaalQuery.resolver(root, info, **kwargs)

    def resolve_signalen(root, info, **kwargs):
        return SignalenQuery.resolver(root, info, **kwargs)

    def resolve_saldo(root, info, **kwargs):
        return SaldoQuery.resolver(root, info, **kwargs)

    def resolve_burger_rapportages(root, info, **kwargs):
        return BurgerRapportagesQuery.resolver(root, info, **kwargs)

    def resolve_search_afspraken(root, info, **kwargs):
        return SearchAfsprakenQuery.resolver(root, info, **kwargs)

    def resolve_search_transacties(root, info, **kwargs):
        return BankTransactionsSearchQuery.resolver(root, info, **kwargs)

    def resolve_overzicht(root, info, **kwargs):
        return OverzichtQuery.resolver(root, info, **kwargs)
