import json

import requests
from graphql import GraphQLError

from hhb_backend.graphql import settings
from hhb_backend.graphql.dataloaders import hhb_dataloader


def create_afdeling_postadres(input, afdeling_id):
    contactCatalogus_input = {
        "street": input.get("straatnaam"),
        "houseNumber": input.get("huisnummer"),
        "postalCode": input.get("postcode"),
        "locality": input.get("plaatsnaam")
    }

    contactCatalogus_response = requests.post(
        f"{settings.POSTADRESSEN_SERVICE_URL}/addresses",
        json=contactCatalogus_input
    )
    if contactCatalogus_response.status_code != 201:
        raise GraphQLError(f"Upstream API responded: {contactCatalogus_response.json()}")

    result = contactCatalogus_response.json()['data']

    previous_afdeling = hhb_dataloader().afdeling_by_id.load(afdeling_id)

    postadressen_ids = list(
        previous_afdeling["post_adressen_ids"]
        if previous_afdeling.get("postadressen_ids")
        else []
    )

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

    return {
        "id": result.pop("id"),
        "huisnummer": result.pop("houseNumber"),
        "postcode": result.pop("postalCode"),
        "straatnaam": result.pop("street"),
        "plaatsnaam": result.pop("locality")
    }
