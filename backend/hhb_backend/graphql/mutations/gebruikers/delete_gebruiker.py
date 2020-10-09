""" GraphQL mutation for deleting a Gebruiker/Burger """
import os
import json
import graphene
import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings

class DeleteGebruiker(graphene.Mutation):
    class Arguments:
        # gebruiker arguments
        gebruiker_id = graphene.Int(required=True)
        force = graphene.Boolean(default_value=False)

    ok = graphene.Boolean()

    def mutate(root, info, gebruiker_id, force):
        """ Delete current gebruiker

        force:  if set to true the gebruiker reccord will be deleted,
                otherwise only the burger is deleted
                and the gebruikers fields are cleared
        """
        if force:
            delete_response = requests.delete(
                os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{gebruiker_id}")
            )
            if delete_response.status_code == 204:
                return DeleteGebruiker(ok=True)
            raise GraphQLError(f"Upstream API responded: {delete_response.json()}")


        gebruiker_data = {"email": "", "geboortedatum": "", "telefoonnummer": ""}
        delete_burger_response = requests.delete(
            os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{gebruiker_id}/burger")
        )
        if delete_burger_response.status_code not in [204, 404]:
            raise GraphQLError(f"Upstream API responded: {delete_burger_response.json()}")

        gebruiker_response = requests.patch(
            os.path.join(settings.HHB_SERVICES_URL, f"gebruikers/{gebruiker_id}/"), 
            data=json.dumps(gebruiker_data),
            headers={'Content-type': 'application/json'}
        )
        if gebruiker_response.status_code != 200:
            raise GraphQLError(f"Upstream API responded: {gebruiker_response.json()}")

        return DeleteGebruiker(ok=True)
