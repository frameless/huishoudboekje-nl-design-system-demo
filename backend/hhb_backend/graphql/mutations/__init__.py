""" GraphQL schema mutations module """
import graphene

from .configuraties.configuraties import CreateConfiguratie, DeleteConfiguratie, UpdateConfiguratie
from .burgers.create_burger import CreateBurger
from .burgers.delete_burger import DeleteBurger
from .burgers.update_burger import UpdateBurger
from .journaalposten.create_journaalpost import CreateJournaalpostAfspraak, CreateJournaalpostGrootboekrekening, \
    CreateJournaalpostPerAfspraak
from .journaalposten.update_journaalpost import UpdateJournaalpostGrootboekrekening
from .journaalposten.delete_journaalpost import DeleteJournaalpost
from .organisaties.create_organisatie import CreateOrganisatie
from .organisaties.update_organisatie import UpdateOrganisatie
from .organisaties.delete_organisatie import DeleteOrganisatie
from .afspraken.create_afspraak import CreateAfspraak
from .afspraken.update_afspraak import UpdateAfspraak
from .afspraken.delete_afspraak import DeleteAfspraak
from .overschrijvingen.start_automatisch_boeken import StartAutomatischBoeken
from .rekeningen.update_rekening import UpdateRekening
from .rekeningen.create_burger_rekening import CreateBurgerRekening
from .rekeningen.delete_burger_rekening import DeleteBurgerRekening
from .rekeningen.create_organisatie_rekening import CreateOrganisatieRekening
from .rekeningen.delete_organisatie_rekening import DeleteOrganisatieRekening
from .customer_statement_messages.delete_customer_statement_message import DeleteCustomerStatementMessage
from .customer_statement_messages.create_customer_statement_message import  CreateCustomerStatementMessage
from .rubrieken.create_rubriek import CreateRubriek
from .rubrieken.update_rubriek import UpdateRubriek
from .rubrieken.delete_rubriek import DeleteRubriek
from .overschrijvingen.create_export_overschrijvingen import CreateExportOverschrijvingen

class RootMutation(graphene.ObjectType):
    """ The root of all mutations """
    createBurger = CreateBurger.Field()
    deleteBurger = DeleteBurger.Field()
    updateBurger = UpdateBurger.Field()
    createAfspraak = CreateAfspraak.Field()
    updateAfspraak = UpdateAfspraak.Field()
    deleteAfspraak = DeleteAfspraak.Field()
    createOrganisatie = CreateOrganisatie.Field()
    updateOrganisatie = UpdateOrganisatie.Field()
    deleteOrganisatie = DeleteOrganisatie.Field()
    createBurgerRekening = CreateBurgerRekening.Field()
    deleteBurgerRekening = DeleteBurgerRekening.Field()
    createOrganisatieRekening = CreateOrganisatieRekening.Field()
    deleteOrganisatieRekening = DeleteOrganisatieRekening.Field()
    updateRekening = UpdateRekening.Field()
    deleteCustomerStatementMessage = DeleteCustomerStatementMessage.Field()
    createCustomerStatementMessage = CreateCustomerStatementMessage.Field()

    createJournaalpostAfspraak = CreateJournaalpostAfspraak.Field()
    createJournaalpostPerAfspraak = CreateJournaalpostPerAfspraak.Field()
    createJournaalpostGrootboekrekening = CreateJournaalpostGrootboekrekening.Field()
    updateJournaalpostGrootboekrekening = UpdateJournaalpostGrootboekrekening.Field()
    deleteJournaalpost = DeleteJournaalpost.Field()

    createRubriek = CreateRubriek.Field()
    updateRubriek = UpdateRubriek.Field()
    deleteRubriek = DeleteRubriek.Field()

    createConfiguratie = CreateConfiguratie.Field()
    updateConfiguratie = UpdateConfiguratie.Field()
    deleteConfiguratie = DeleteConfiguratie.Field()

    createExportOverschrijvingen = CreateExportOverschrijvingen.Field()
    startAutomatischBoeken = StartAutomatischBoeken.Field()
