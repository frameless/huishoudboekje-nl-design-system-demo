from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import ORGANISATIE_SERVICES_URL
from hhb_backend.service.model.organisatie import Organisatie


class OrganisatieLoader(DataLoader[Organisatie]):
    service = ORGANISATIE_SERVICES_URL
    model = "organisaties"


    #rekening ids ophalen van organisatie met rekening _id