from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class OverschrijvingByIdLoader(DataLoader):
    """ Load overschrijvingen using ids """
    model = "overschrijvingen"


class OverschrijvingenByAfspraakLoader(DataLoader):
    """ Load overschrijvingen using afspraak id """
    model = "overschrijvingen"
    filter_item = "filter_afspraken"
