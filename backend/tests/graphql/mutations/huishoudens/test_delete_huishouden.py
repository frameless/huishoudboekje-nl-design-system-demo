import requests_mock
from hhb_backend.graphql import settings

def test_delete_huishouden(client):
    with requests_mock.Mocker() as mock:
        mock.get(
            f"{settings.HHB_SERVICES_URL}/huishoudens/?filter_ids=1",
            status_code=200,
            json={"data": [{"id": 1}]},
        )
        mock.post(
            f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
            json={"data": {"id": 1}},
        )
        adapter = mock.delete(
            f"{settings.HHB_SERVICES_URL}/huishoudens/1", status_code=204
        )

        response = client.post(
            "/graphql",
            json={
                "query": """
                        mutation test($id: Int!) {
                          deleteHuishouden(id: $id) {
                            ok
                          }
                        }
                        """,
                "variables": {"id": 1},
            },
            content_type="application/json",
        )
        assert response.json == {
            "data": {
                "deleteHuishouden": {
                    "ok": True,
                }
            }
        }
        assert adapter.called_once

def test_delete_huishouden_error(client):
    with requests_mock.Mocker() as mock:
        adapter = mock.get(f"{settings.HHB_SERVICES_URL}/huishoudens/?filter_ids=1", status_code=404, text="Not found")

        response = client.post(
            "/graphql",
            json={
                "query": '''
                        mutation test($id: Int!) {
                          deleteHuishouden(id: $id) {
                            ok
                          }
                        }
                        ''',
                "variables": {"id": 1}},
            content_type='application/json'
        )
        assert response.json == {"data": {"deleteHuishouden": None},
                                 "errors": [{"locations": [{"column": 27, "line": 3}],
                                             "message": "Upstream API responded: Not found",
                                             "path": ["deleteHuishouden"]}]}
        assert adapter.called_once


huishouden_data = {
    "burgers": [2],
    "id": 2
}

def test_delete_huishouden_burger(client):
    with requests_mock.Mocker() as rm:
        # arrange
        request = {
            "query": '''
                mutation test($burgerIds: [Int]!, $huishoudenId: Int!) {
                    deleteHuishoudenBurger(burgerIds: $burgerIds, huishoudenId: $huishoudenId) {
                        ok
                        huishouden{
                            id
                            burgers{
                                id
                            }
                        }
                    }
                }
                ''',
            "variables": {"burgerIds": [2], "huishoudenId": 2}}
        expected = {'data': {'deleteHuishoudenBurger': {'ok': True, 'huishouden': [{'id': 3, 'burgers': [{'id': 2}]}]}}}
        new_huishouden = {'id': 3}
        burger_1 = {
            "achternaam": "pieterson",
            "bsn": 285278939,
            "email": None,
            "geboortedatum": None,
            "huishouden_id": 3,
            "huisnummer": None,
            "iban": None,
            "id": 2,
            "plaatsnaam": None,
            "postcode": None,
            "straatnaam": None,
            "telefoonnummer": None,
            "voorletters": None,
            "voornamen": "piet pieter"
        }

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/huishoudens/?filter_ids=2", status_code=200, json={"data": [huishouden_data]})
        rm2 = rm.post(f"{settings.HHB_SERVICES_URL}/huishoudens/", status_code=201, json={'data': new_huishouden})
        rm3 = rm.post(f"{settings.HHB_SERVICES_URL}/burgers/2", status_code=201, json={"data": burger_1})
        rm4 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201, json={"data": {"id": 1}})
        rm5 = rm.get(f"{settings.HHB_SERVICES_URL}/burgers/?filter_huishoudens=3", status_code=200, json={"data": [burger_1]})

        # act
        response = client.post("/graphql", json=request, content_type='application/json')


        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert rm5.called_once
        assert fallback.called == 0
        assert response.json == expected