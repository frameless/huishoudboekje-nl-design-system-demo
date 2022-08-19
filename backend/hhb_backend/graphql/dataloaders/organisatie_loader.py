from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class OrganisatieLoader(DataLoader):
    service = settings.ORGANISATIE_SERVICES_URL
    model = "organisaties"
