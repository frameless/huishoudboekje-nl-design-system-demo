import pytest
import requests_mock
from pydash import objects

from hhb_backend.graphql import settings
from tests import post_echo, post_echo_with_id


def test_create_huishouden_success(client):
    with requests_mock.mock() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)
        log_post = mock.register_uri(
            "POST",
            f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
            status_code=200,
            json=post_echo,
        )
        huishoudens_post = mock.register_uri(
            "POST",
            f"{settings.HHB_SERVICES_URL}/huishoudens/",
            json=post_echo_with_id(0),
            status_code=201,
        )
        response = client.post(
            "/graphql",
            json={
                "query": """
                    mutation test($input:CreateHuishoudenInput!) {
                      createHuishouden(input:$input) {
                        ok
                        huishouden {
                          id
                        }
                      }
                    }""",
                "variables": {"input": {}},
            },
        )

        assert objects.get(response.json, "errors") == None
        assert response.json == {
            "data": {"createHuishouden": {"ok": True, "huishouden": {"id": 1}}}
        }
        assert huishoudens_post.called_once

        # No leftover calls
        assert log_post.called_once
        assert not post_any.called
        assert not get_any.called


def test_create_huishouden_with_burger_ids_success(client):
    with requests_mock.mock() as mock:
        post_adapter = mock.post(f"{settings.HHB_SERVICES_URL}/burgers/1",
                                 status_code=200, json={"data": {"id": 1, "voornamen": "Fien Sandra"}})
        get_adapter = mock.get(
            f"{settings.HHB_SERVICES_URL}/burgers/?filter_ids=1",
            status_code=200,
            json={"data": [{"achternaam": "de Jager",
                            "bsn": 999111222,
                            "email": "fien.de.jager@sloothuizen.nl",
                            "geboortedatum": "1987-06-18",
                            "huishouden_id": 1,
                            "huisnummer": "14",
                            "iban": "",
                            "id": 1,
                            "plaatsnaam": "Sloothuizen",
                            "postcode": "9999ZZ",
                            "straatnaam": "Winkelstraat",
                            "telefoonnummer": "0612345678",
                            "voorletters": "F.S.",
                            "voornamen": "Fien Sandra"}]})

        log_post = mock.register_uri(
            "POST",
            f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
            status_code=200,
            json=post_echo,
        )
        huishoudens_post = mock.register_uri(
            "POST",
            f"{settings.HHB_SERVICES_URL}/huishoudens/",
            json=post_echo_with_id(0),
            status_code=201,
        )

        response = client.post(
            "/graphql",
            json={
                "query": """
                            mutation test($input:CreateHuishoudenInput!) {
                              createHuishouden(input:$input) {
                                ok
                                huishouden {
                                  id
                                }
                              }
                            }""",
                "variables": {"input": {"burgerIds": [1]}},
            },
        )

        assert objects.get(response.json, "errors") == None
        assert response.json["data"]["createHuishouden"]["ok"] is True
        assert huishoudens_post.called_once

        # No leftover calls
        assert log_post.called_once
        assert get_adapter.called_once
        assert post_adapter.called_once

