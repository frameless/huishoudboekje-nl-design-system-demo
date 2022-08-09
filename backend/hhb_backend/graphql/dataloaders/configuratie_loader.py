from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class ConfiguratieByIdLoader(DataLoader):
    """ Load config using ids """
    model = "configuratie"
