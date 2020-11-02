import requests
from graphql import GraphQLError
from promise import Promise
from aiodataloader import DataLoader
from hhb_backend.graphql import settings

class GebruikersByIdLoader(DataLoader):
    async def batch_load_fn(self, keys):
        gebruiker_response = requests.get(f"{settings.HHB_SERVICES_URL}/gebruikers/?filter_ids={','.join([str(k) for k in keys])}")
        if gebruiker_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {gebruiker_response.json()}")
        gebruikers = {}
        for gebruiker in gebruiker_response.json()["data"]:
            gebruikers[gebruiker["id"]] = gebruiker
        return [gebruikers.get(key, None) for key in keys]
