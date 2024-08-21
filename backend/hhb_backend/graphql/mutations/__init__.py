""" GraphQL schema mutations module """
import graphene

from .afdelingen.create_afdeling import CreateAfdeling
from .afdelingen.delete_afdeling import DeleteAfdeling
from .afdelingen.update_afdeling import UpdateAfdeling
from .afspraken.add_afspraak_zoekterm import AddAfspraakZoekterm
from .afspraken.create_afspraak import CreateAfspraak
from .afspraken.delete_afspraak import DeleteAfspraak
from .afspraken.delete_afspraak_betaalinstructie import DeleteAfspraakBetaalinstructie
from .afspraken.delete_afspraak_zoekterm import DeleteAfspraakZoekterm
from .afspraken.update_afspraak import UpdateAfspraak
from .afspraken.update_afspraak_betaalinstructie import UpdateAfspraakBetaalinstructie
from .burgers.create_burger import CreateBurger
from .burgers.delete_burger import DeleteBurger
from .burgers.update_burger import EndBurger, UpdateBurger
from .configuraties.configuraties import CreateConfiguratie, DeleteConfiguratie, UpdateConfiguratie
from .customer_statement_messages.create_customer_statement_message import CreateCustomerStatementMessage
from .customer_statement_messages.delete_customer_statement_message import DeleteCustomerStatementMessage
from .huishoudens.add_huishouden_burger import AddHuishoudenBurger
from .huishoudens.create_huishouden import CreateHuishouden
from .huishoudens.delete_huishouden import DeleteHuishouden
from .huishoudens.delete_huishouden import DeleteHuishouden
from .huishoudens.delete_huishouden_burger import DeleteHuishoudenBurger
from .journaalposten.create_journaalpost import CreateJournaalpostAfspraak, CreateJournaalpostGrootboekrekening
from .journaalposten.delete_journaalpost import DeleteJournaalpost
from .organisaties.create_organisatie import CreateOrganisatie
from .organisaties.delete_organisatie import DeleteOrganisatie
from .organisaties.update_organisatie import UpdateOrganisatie
from .overschrijvingen.create_export_overschrijvingen import CreateExportOverschrijvingen
from .overschrijvingen.start_automatisch_boeken import StartAutomatischBoeken
from .postadressen.create_postadres import CreatePostadres
from .postadressen.delete_postadres import DeletePostadres
from .postadressen.update_postadres import UpdatePostadres
from .rekeningen.create_afdeling_rekening import CreateAfdelingRekening
from .rekeningen.create_burger_rekening import CreateBurgerRekening
from .rekeningen.delete_afdeling_rekening import DeleteAfdelingRekening
from .rekeningen.delete_burger_rekening import DeleteBurgerRekening
from .rekeningen.update_rekening import UpdateRekening
from .rubrieken.create_rubriek import CreateRubriek
from .rubrieken.delete_rubriek import DeleteRubriek
from .rubrieken.update_rubriek import UpdateRubriek
from .burgers.update_burger_saldo_alarm import UpdateBurgerSaldoAlarm


class RootMutation(graphene.ObjectType):
    """ The root of all mutations """
    createBurger = CreateBurger.Field()
    deleteBurger = DeleteBurger.Field()
    updateBurger = UpdateBurger.Field()
    updateBurgerSaldoAlarm = UpdateBurgerSaldoAlarm.Field()
    endBurger = EndBurger.Field()

    createAfspraak = CreateAfspraak.Field()
    updateAfspraak = UpdateAfspraak.Field()
    deleteAfspraak = DeleteAfspraak.Field()
    updateAfspraakBetaalinstructie = UpdateAfspraakBetaalinstructie.Field()
    addAfspraakZoekterm = AddAfspraakZoekterm.Field()
    deleteAfspraakZoekterm = DeleteAfspraakZoekterm.Field()
    deleteAfspraakBetaalinstructie = DeleteAfspraakBetaalinstructie.Field()

    createOrganisatie = CreateOrganisatie.Field()
    updateOrganisatie = UpdateOrganisatie.Field()
    deleteOrganisatie = DeleteOrganisatie.Field()

    createBurgerRekening = CreateBurgerRekening.Field()
    deleteBurgerRekening = DeleteBurgerRekening.Field()
    createAfdelingRekening = CreateAfdelingRekening.Field()
    deleteAfdelingRekening = DeleteAfdelingRekening.Field()
    updateRekening = UpdateRekening.Field()

    deleteCustomerStatementMessage = DeleteCustomerStatementMessage.Field()
    createCustomerStatementMessage = CreateCustomerStatementMessage.Field()

    createJournaalpostAfspraak = CreateJournaalpostAfspraak.Field()
    createJournaalpostGrootboekrekening = CreateJournaalpostGrootboekrekening.Field()
    deleteJournaalpost = DeleteJournaalpost.Field()

    createRubriek = CreateRubriek.Field()
    updateRubriek = UpdateRubriek.Field()
    deleteRubriek = DeleteRubriek.Field()

    createConfiguratie = CreateConfiguratie.Field()
    updateConfiguratie = UpdateConfiguratie.Field()
    deleteConfiguratie = DeleteConfiguratie.Field()

    createExportOverschrijvingen = CreateExportOverschrijvingen.Field()
    startAutomatischBoeken = StartAutomatischBoeken.Field()

    createHuishouden = CreateHuishouden.Field()
    deleteHuishouden = DeleteHuishouden.Field()
    addHuishoudenBurger = AddHuishoudenBurger.Field()
    deleteHuishoudenBurger = DeleteHuishoudenBurger.Field()

    createAfdeling = CreateAfdeling.Field()
    updateAfdeling = UpdateAfdeling.Field()
    deleteAfdeling = DeleteAfdeling.Field()

    createPostadres = CreatePostadres.Field()
    updatePostadres = UpdatePostadres.Field()
    deletePostadres = DeletePostadres.Field()

