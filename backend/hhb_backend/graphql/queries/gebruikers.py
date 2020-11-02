""" GraphQL Gebruikers query """
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings
import hhb_backend.graphql.models.gebruiker as gebruiker


class GebruikerQuery():
    return_type = graphene.Field(gebruiker.Gebruiker, id=graphene.Int(required=True))

    @staticmethod
    def resolver(root, info, **kwargs):
        gebruiker_response = requests.get(f"{settings.HHB_SERVICES_URL}/gebruikers/{kwargs['id']}")
        if gebruiker_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {gebruiker_response.json()}")

        gebruiker_json = gebruiker_response.json()["data"]

        if "afspraken" in info.context.json["query"]:
            print("Runningin afspraken query")
            afspraken_response = requests.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_gebruikers={gebruiker_json['id']}")
            if afspraken_response.status_code != 200:
                raise GraphQLError(f"Upstream API responded: {afspraken_response.json()}")

            gebruiker_json["afspraken"] = afspraken_response.json()["data"]

        return gebruiker_json


class GebruikersQuery():
    return_type = graphene.List(gebruiker.Gebruiker, ids=graphene.List(graphene.Int, default_value=[]))

    @staticmethod
    def resolver(root, info, **kwargs):
        filter_query = ""
        if kwargs["ids"]:
            filter_query = "?filter_ids=" + ",".join([str(id) for id in kwargs['ids']])
        gebruikers_response = requests.get(f"{settings.HHB_SERVICES_URL}/gebruikers/{filter_query}")
        if gebruikers_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {gebruikers_response.json}")

        gebruikers_json = gebruikers_response.json()["data"]

        gebruiker_ids = [g["id"] for g in gebruikers_json]

        if "afspraken" in info.context.json["query"]:
            afspraken_response = requests.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_gebruikers={','.join([str(g) for g in gebruiker_ids])}")
            if afspraken_response.status_code != 200:
                raise GraphQLError(f"Upstream API responded: {afspraken_response.json()}")
            
            for gebruiker in gebruikers_json:
                gebruiker["afspraken"] = [a for a in afspraken_response.json()["data"] if a["gebruiker_id"] == gebruiker["id"]]
                
        return gebruikers_json
