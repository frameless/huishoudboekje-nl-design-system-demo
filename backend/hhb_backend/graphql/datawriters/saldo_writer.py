from hhb_backend.graphql import settings
from hhb_backend.graphql.datawriters.datawriter import DataWriter


class SaldoWriter(DataWriter):
    """ Mutations on saldo """
    model = "saldo"
    service = settings.HHB_SERVICES_URL
