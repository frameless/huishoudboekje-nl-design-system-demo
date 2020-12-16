from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader, ListDataLoader


class OverschrijvingByIdLoader(SingleDataLoader):
    """ Load overschrijvingen using ids """
    model = "overschijvingen"


class OverschrijvingByAfspraakLoader(ListDataLoader):
    """ Load overschrijvingen using afspraak id """
    model = "overschrijvingen"
    filter_item = "filter_afspraken"
    index = "afspraak_id"


class OverschrijvingByExportLoader(ListDataLoader):
    """ Load overschrijvingen using export id """
    model = "overschrijvingen"
    filter_item = "filter_exports"
    index = "export_id"
