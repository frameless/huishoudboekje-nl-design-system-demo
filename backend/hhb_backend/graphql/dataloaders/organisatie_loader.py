from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import ORGANISATIE_SERVICES_URL


class OrganisatieLoader(DataLoader):
    service = ORGANISATIE_SERVICES_URL
    model = "organisaties"
