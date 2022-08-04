from hhb_backend.graphql import settings
from hhb_backend.graphql.datawriters.datawriter import DataWriter

class OrganisatieWriter(DataWriter):
    """ Load organisaties using ids """
    model = "organisaties"
    service = settings.ORGANISATIE_SERVICES_URL
