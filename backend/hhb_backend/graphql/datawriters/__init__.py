from hhb_backend.graphql.datawriters.organisatie_writer import OrganisatieWriter
from hhb_backend.graphql.datawriters.journaalposten_writer import JournaalpostenWriter
from hhb_backend.graphql.datawriters.saldo_writer import SaldoWriter


class HHBDataWriter:
    """Main Datawriter class for HHB"""

    def __init__(self):
        self.organisaties = OrganisatieWriter()
        self.journaalposten = JournaalpostenWriter()
        self.saldo = SaldoWriter()


def hhb_datawriter() -> HHBDataWriter:
    return HHBDataWriter()
