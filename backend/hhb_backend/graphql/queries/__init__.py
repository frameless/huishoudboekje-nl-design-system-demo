""" GraphQL schema queries module """
import graphene

from .gebruikers import GebruikersQuery, GebruikerQuery
from .organisaties import OrganisatieQuery, OrganisatiesQuery
from .afspraken import AfspraakQuery, AfsprakenQuery
from .rekeningen import RekeningQuery, RekeningenQuery


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
