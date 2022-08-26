from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL
from hhb_backend.service.model.configuratie import Configuratie


class ConfiguratieLoader(DataLoader[Configuratie]):
    service = HHB_SERVICES_URL
    model = "configuratie"
