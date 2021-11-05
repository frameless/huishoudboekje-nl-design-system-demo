import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings

def delete_afdeling_util(afdeling):
    response_hhb = requests.delete(
        f"{settings.HHB_SERVICES_URL}/afdelingen/{afdeling['id']}"
    )
    if response_hhb.status_code != 204:
        raise GraphQLError(f"Upstream API responded: {response_hhb.text}")

    response_organisatie = requests.delete(
        f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{afdeling['id']}"
    )
    if response_organisatie.status_code != 204:
        raise GraphQLError(f"Upstream API responded: {response_organisatie.text}")

    postadressen = afdeling.get("postadressen_ids")
    if postadressen and len(postadressen) > 0:
        for postadres_id in postadressen:
            response_ContactCatalogus = requests.delete(
                f"{settings.CONTACTCATALOGUS_SERVICE_URL}/addresses/{postadres_id}",
                headers={"Authorization": "45c1a4b6-59d3-4a6e-86bf-88a872f35845"}
            )
            if response_ContactCatalogus.status_code != 204:
                raise GraphQLError(f"Upstream API responded: {response_ContactCatalogus.text}")

    return