from hhb_backend.graphql import settings
from hhb_backend.graphql.datawriters.datawriter import DataWriter

class JournaalpostenWriter(DataWriter):
    """ Mutations on journaalposten """
    model = "journaalposten"
    service = settings.HHB_SERVICES_URL
