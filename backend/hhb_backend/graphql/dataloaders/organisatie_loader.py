from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class OrganisatieByIdLoader(DataLoader):
    """ Load organisaties using ids """
    model = "organisaties"
    service = settings.ORGANISATIE_SERVICES_URL
