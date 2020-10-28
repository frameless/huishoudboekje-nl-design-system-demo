""" GraphQL schema mutations module """
import graphene
from .gebruikers.create_gebruiker import CreateGebruiker
from .gebruikers.delete_gebruiker import DeleteGebruiker
from .gebruikers.update_gebruiker import UpdateGebruiker
from .organisaties.create_organisatie import CreateOrganisatie
from .organisaties.update_organisatie import UpdateOrganisatie
from .organisaties.delete_organisatie import DeleteOrganisatie
from .afspraken.add_afspraak import AddAfspraak
from .afspraken.update_afspraak import UpdateAfspraak
from .afspraken.delete_afspraak import DeleteAfspraak

class RootMutation(graphene.ObjectType):
    """ The root of all mutations """
    createGebruiker = CreateGebruiker.Field()
    deleteGebruiker = DeleteGebruiker.Field()
    updateGebruiker = UpdateGebruiker.Field()
    addAfspraak = AddAfspraak.Field()
    updateAfspraak = UpdateAfspraak.Field()
    deleteAfspraak = DeleteAfspraak.Field()
    createOrganisatie = CreateOrganisatie.Field()
    updateOrganisatie = UpdateOrganisatie.Field()
    deleteOrganisatie = DeleteOrganisatie.Field()