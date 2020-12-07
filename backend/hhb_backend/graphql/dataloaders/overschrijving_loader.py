from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader, ListDataLoader

class OverschrijvingByIdLoader(SingleDataLoader):
    """ Load overschrijvingen using ids """
    model = "overschijvingen"

class OverschijvingByAfspraakLoader(ListDataLoader):
    """ Load overschijvingen using afspraak id """
    model = "overschrijvingen"
    filter_item = "filter_afspraken"
    index = "afspraak_id"
