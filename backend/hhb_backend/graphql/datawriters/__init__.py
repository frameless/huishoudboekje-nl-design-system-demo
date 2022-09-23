from hhb_backend.graphql.datawriters.organisatie_writer import OrganisatieWriter

class HHBDataWriter:
    """Main Datawriter class for HHB"""

    def __init__(self):
        self.organisaties = OrganisatieWriter()

def hhb_datawriter() -> HHBDataWriter:
    return HHBDataWriter()