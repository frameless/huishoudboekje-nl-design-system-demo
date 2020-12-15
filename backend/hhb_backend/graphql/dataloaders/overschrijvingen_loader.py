from hhb_backend.graphql.dataloaders.base_loader import ListDataLoader


class OverschrijvingenByAfsprakenLoader(ListDataLoader):
    """ Load overschrijvingen list for afspraken ids """
    model = "overschrijvingen"
    filter_item = "filter_afspraken"
    index = "afspraak_id"
