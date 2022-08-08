import json

import requests
from graphql import GraphQLError
from hhb_backend.graphql import settings

def create_afdeling_postadres(input, afdeling_id):
    contactCatalogus_input = {
        "street": input.get("straatnaam"),
        "houseNumber": input.get("huisnummer"),
        "postalCode": input.get("postcode"),
        "locality": input.get("plaatsnaam")
    }

    contactCatalogus_response = requests.post(
        f"{settings.POSTADRESSEN_SERVICE_URL}/addresses",
        data=json.dumps(contactCatalogus_input)
    )
    if contactCatalogus_response.status_code != 201:
        raise GraphQLError(f"Upstream API responded: {contactCatalogus_response.json()}")

    result = contactCatalogus_response.json()['data']

    previous_afdeling = requests.get(
        f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{afdeling_id}",
        headers={"Content-type": "application/json"}
    ).json()['data']

    if previous_afdeling.get("postadressen_ids"):
        postadressen_ids = list(previous_afdeling["postadressen_ids"])
    else:
        postadressen_ids = list()

    postadressen_ids.append(result['id'])

    afdeling_input = {
        **previous_afdeling,
        "postadressen_ids": postadressen_ids
    }

    update_afdeling_response = requests.post(
        f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/{afdeling_id}",
        json=afdeling_input,
        headers={"Content-type": "application/json"},
    )
    if update_afdeling_response.status_code != 200:
        raise GraphQLError(
            f"Upstream API responded: {update_afdeling_response.json()}"
        )
    result2 = {}

    result2["id"] = result.pop("id")
    result2["huisnummer"] = result.pop("houseNumber")
    result2["postcode"] = result.pop("postalCode")
    result2["straatnaam"] = result.pop("street")
    result2["plaatsnaam"] = result.pop("locality")

    return result2