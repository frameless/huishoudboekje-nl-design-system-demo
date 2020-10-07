import os
import graphene
import requests
import json
from hhb_backend.graphql import settings
from hhb_backend.graphql.models.gebruiker import Gebruiker

class DeleteGebruiker(graphene.Mutation):
    class Arguments:
        # gebruiker arguments
        gebruiker_id = graphene.Int(required=True)
        force = graphene.Boolean(default_value=False)

    ok = graphene.Boolean()

    def mutate(root, info, gebruiker_id, force):
        if force:
            delete_response = requests.delete(
                os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{gebruiker_id}")
            )
            if delete_response.status_code == 204:
                return DeleteGebruiker(ok=True)
            print(delete_response.json()) # print error message to screen for now
            return DeleteGebruiker(ok=False)


        gebruiker_data = {"email": "", "geboortedatum": "", "telefoonnummer": ""}
        delete_burger_response = requests.delete(
            os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{gebruiker_id}/burger")
        )
        if delete_burger_response.status_code not in [204, 404]:
            print(delete_burger_response.status_code)
            return DeleteGebruiker(ok=False)
        gebruiker_response = requests.patch(
            os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{gebruiker_id}/"), 
            data=json.dumps(gebruiker_data),
            headers={'Content-type': 'application/json'}
        )
        if gebruiker_response.status_code != 200:
            print(gebruiker_response.json()) # print error message to screen for now
            return DeleteGebruiker(ok=False)
        return DeleteGebruiker(ok=True)
