from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader


class ConfiguratieByIdLoader(SingleDataLoader):
    """ Load config using ids """
    model = "configuratie"
