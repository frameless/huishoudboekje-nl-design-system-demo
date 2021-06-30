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


# TODO: Fix this test!!!
#   For some reason, this test fails with the following response:
#   -----
#   {'data': {'createHuishouden': None},
#  'errors': [{'locations': [{'column': 31, 'line': 3}],
#              'message': 'Upstream API responded: ',
#              'path': ['createHuishouden']}]}
#   -----
#   It seems to have to do something with the relationship between burgers and huishoudens.
#   See also: test_create_burger.py/test_create_burger_with_huishouden_id_success
# def test_create_huishouden_with_burger_ids_success(client):
#     with requests_mock.mock() as mock:
#         get_any = mock.get(requests_mock.ANY, status_code=404)
#         post_any = mock.post(requests_mock.ANY, status_code=404)
#         log_post = mock.register_uri(
#             "POST",
#             f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
#             status_code=200,
#             json=post_echo,
#         )
#         huishoudens_post = mock.register_uri(
#             "POST",
#             f"{settings.HHB_SERVICES_URL}/huishoudens/",
#             json=post_echo_with_id(0),
#             status_code=201,
#         )
#
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": """
#                             mutation test($input:CreateHuishoudenInput!) {
#                               createHuishouden(input:$input) {
#                                 ok
#                                 huishouden {
#                                   id
#                                 }
#                               }
#                             }""",
#                 "variables": {"input": {"burgerIds": [1]}},
#             },
#         )
#
#         from pprint import pprint
#         print()
#         print()
#         pprint(response.json)
#         print()
#         print()
#
#         assert objects.get(response.json, "errors") == None
#         assert response.json["data"]["createHuishouden"]["ok"] is True
#         assert huishoudens_post.called_once
#
#         # No leftover calls
#         assert log_post.called_once
#         assert not post_any.called
#         assert not get_any.called
