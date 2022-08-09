from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class GebruikersactiviteitenByIdLoader(DataLoader):
    """ Load gebruikersactiviteiten using id """
    service = settings.LOG_SERVICE_URL
    model = "gebruikersactiviteiten"


class GebruikersactiviteitenByBurgerLoader(DataLoader):
    service = settings.LOG_SERVICE_URL
    model = "gebruikersactiviteiten"
    filter_item = "filter_burgers"


class GebruikersactiviteitenByBurgersLoader(DataLoader):
    service = settings.LOG_SERVICE_URL
    model = "gebruikersactiviteiten"
    filter_item = "filter_burgers"


class GebruikersActiviteitenByAfsprakenLoader(DataLoader):
    model = "gebruikersactiviteiten"
    service = settings.LOG_SERVICE_URL
    filter_item = "filter_afspraken"


class GebruikersActiviteitenByHuishoudenLoader(DataLoader):
    model = "gebruikersactiviteiten"
    service = settings.LOG_SERVICE_URL
    filter_item = "filter_huishouden"
