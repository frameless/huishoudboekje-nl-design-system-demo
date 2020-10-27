""" GraphQL schema mutations module """
import graphene
from .gebruikers.create_gebruiker import CreateGebruiker
from .gebruikers.delete_gebruiker import DeleteGebruiker
from .gebruikers.update_gebruiker import UpdateGebruiker
from .organisaties.create_organisatie import CreateOrganisatie
from .organisaties.update_organisatie import UpdateOrganisatie
from .organisaties.delete_organisatie import DeleteOrganisatie
from .gebruikers.add_gebruiker_afspraak import AddGebruikerAfspraak
from .gebruikers.update_gebruiker_afspraak import UpdateGebruikerAfspraak

class RootMutation(graphene.ObjectType):
    """ The root of all mutations """
    createGebruiker = CreateGebruiker.Field()
    deleteGebruiker = DeleteGebruiker.Field()
    updateGebruiker = UpdateGebruiker.Field()
    addGebruikerAfspraak = AddGebruikerAfspraak.Field()
    updateGebruikerAfspraak = UpdateGebruikerAfspraak.Field()
    createOrganisatie = CreateOrganisatie.Field()
    updateOrganisatie = UpdateOrganisatie.Field()
    deleteOrganisatie = DeleteOrganisatie.Field()