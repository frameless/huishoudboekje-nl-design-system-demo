import pytest
import requests_mock
from pydash import objects

from hhb_backend.graphql import settings
from tests import post_echo, post_echo_with_id


@pytest.fixture
def create_burger(client):
    response = client.post(
        "/graphql",
        json={
            "query": """
            mutation test($input:CreateBurgerInput!) {
              createBurger(input:$input) {
                ok
                burger {
                  id
                }
              }
            }""",
            "variables": {
                "input": {
                    "email": "test@test.com",
                    "geboortedatum": "1999-10-10",
                    "telefoonnummer": "0612345678",
                    "achternaam": "Hulk",
                    "huisnummer": "13a",
                    "postcode": "9999ZZ",
                    "straatnaam": "Hoofdstraat",
                    "voorletters": "H",
                    "voornamen": "Hogan",
                    "plaatsnaam": "Dorp",
                    "rekeningen": [
                        {"iban": "GB33BUKB20201555555555", "rekeninghouder": "C. Lown"}
                    ]
                }
            },
        },
        content_type="application/json",
    )
    assert response.json["data"]["createBurger"]["ok"] is True
    yield response.json["data"]["createBurger"]["burger"]


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


def test_create_huishouden_with_burger_ids_success(client, create_burger):
    burger_id = create_burger["id"]

    with requests_mock.mock() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)

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
            "variables": {"input": {"burgerIds": [burger_id]}},
        },
    )
    assert objects.get(response.json, "errors") == None
    assert response.json["data"]["createHuishouden"]["ok"] is True

    # No leftover calls
    assert not post_any.called
    assert not get_any.called
