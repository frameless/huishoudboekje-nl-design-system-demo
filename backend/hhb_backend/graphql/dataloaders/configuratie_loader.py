from hhb_backend.graphql.dataloaders.base_loader import DataLoader
from hhb_backend.graphql.settings import HHB_SERVICES_URL


class ConfiguratieLoader(DataLoader):
    service = HHB_SERVICES_URL
    model = "configuratie"
