from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import SingleDataLoader


class GebruikersActiviteitenByIdLoader(SingleDataLoader):
    """ Load gebruikersactiviteiten using ids """
    model = "gebruikersactiviteiten"
    service = settings.LOG_SERVICE_URL


class GebruikersActiviteitenByGebruikersLoader(SingleDataLoader):
    model = "gebruikersactiviteiten"
    service = settings.LOG_SERVICE_URL
    filter_item = "filter_gebruikers"
    index = "id"
