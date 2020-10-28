""" GraphQL schema queries module """
import graphene
from .gebruikers import GebruikersQuery, GebruikerQuery
from .organisaties import OrganisatieQuery, OrganisatiesQuery
from .afspraken import AfspraakQuery, AfsprakenQuery

class RootQuery(graphene.ObjectType):
    """ The root of all queries """
    gebruiker = GebruikerQuery.return_type
    gebruikers = GebruikersQuery.return_type
    organisatie = OrganisatieQuery.return_type
    organisaties = OrganisatiesQuery.return_type
    afspraak = AfspraakQuery.return_type
    afspraken = AfsprakenQuery.return_type

    def resolve_gebruiker(root, info, **kwargs):
        return GebruikerQuery.resolver(root, info, **kwargs)

    def resolve_gebruikers(root, info, **kwargs):
        return GebruikersQuery.resolver(root, info, **kwargs)

    def resolve_organisatie(root, info, **kwargs):
        return OrganisatieQuery.resolver(root, info, **kwargs)

    def resolve_organisaties(root, info, **kwargs):
        return OrganisatiesQuery.resolver(root, info, **kwargs)

    def resolve_afspraak(root, info, **kwargs):
        return AfspraakQuery.resolver(root, info, **kwargs)

    def resolve_afspraken(root, info, **kwargs):
        return AfsprakenQuery.resolver(root, info, **kwargs)
