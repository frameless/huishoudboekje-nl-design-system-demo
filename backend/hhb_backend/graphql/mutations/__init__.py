""" GraphQL schema mutations module """
import graphene
from .gebruikers.create_gebruiker import CreateGebruiker
from .gebruikers.delete_gebruiker import DeleteGebruiker
from .gebruikers.update_gebruiker import UpdateGebruiker
from .organisaties.create_organisatie import CreateOrganisatie
from .organisaties.update_organisatie import UpdateOrganisatie
from .organisaties.delete_organisatie import DeleteOrganisatie
from .afspraken.create_afspraak import CreateAfspraak
from .afspraken.update_afspraak import UpdateAfspraak
from .afspraken.delete_afspraak import DeleteAfspraak
from .rekeningen.delete_rekening import DeleteRekening
from .rekeningen.update_rekening import UpdateRekening
from .rekeningen.update_gebruiker_rekening import UpdateGebruikerRekeningen

class RootMutation(graphene.ObjectType):
    """ The root of all mutations """
    createGebruiker = CreateGebruiker.Field()
    deleteGebruiker = DeleteGebruiker.Field()
    updateGebruiker = UpdateGebruiker.Field()
    createAfspraak = CreateAfspraak.Field()
    updateAfspraak = UpdateAfspraak.Field()
    deleteAfspraak = DeleteAfspraak.Field()
    createOrganisatie = CreateOrganisatie.Field()
    updateOrganisatie = UpdateOrganisatie.Field()
    deleteOrganisatie = DeleteOrganisatie.Field()
    updateRekening = UpdateRekening.Field()
    deleteRekening = DeleteRekening.Field()
    updateGebruikerRekeningen = UpdateGebruikerRekeningen.Field()