import requests_mock

from hhb_backend.graphql import settings

huishouden = {
    "burgers": [1],
    "id": 1
}

burger_1 = {
    "id": 1,
    "huishouden_id": 1,
    "voornamen": "piet pieter",
    "achternaam": "pieterson",
    "bsn": 285278939,
    "email": None,
    "geboortedatum": None,
    "huisnummer": None,
    "iban": None,
    "plaatsnaam": None,
    "postcode": None,
    "straatnaam": None,
    "telefoonnummer": None,
    "voorletters": None
}

burger_2 = {
    "id": 2,
    "huishouden_id": 1,
    "voornamen": "henk",
    "achternaam": "hansen",
    "bsn": 356948705,
    "email": None,
    "geboortedatum": None,
    "huisnummer": None,
    "iban": None,
    "plaatsnaam": None,
    "postcode": None,
    "straatnaam": None,
    "telefoonnummer": None,
    "voorletters": None
}


def test_add_huishouden_burger(client):
    with requests_mock.Mocker() as rm:
        # arrange
        burger_ids = [2]
        huishouden_id = 1
        request = {
                "query": '''
                    mutation test($burgerIds: [Int]!, $huishoudenId: Int!){
                        addHuishoudenBurger(burgerIds: $burgerIds, huishoudenId: $huishoudenId){
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
                "variables": {"burgerIds": burger_ids, "huishoudenId": huishouden_id}}

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/huishoudens/?filter_ids=1", json={"data": [huishouden]})
        rm2 = rm.post(f"{settings.HHB_SERVICES_URL}/burgers/2")
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={'data': {'id': 1}})
        rm4 = rm.get(f"{settings.HHB_SERVICES_URL}/burgers/?filter_huishoudens=1", json={"data": [burger_1, burger_2]})
        

        # act
        response = client.post("/graphql", json=request, content_type='application/json')


        # assert
        assert rm1.call_count == 2
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert fallback.called == 0
        assert response.json == {
            'data': {'addHuishoudenBurger': {'huishouden': {'burgers': [{'id': 1}, {'id': 2}], 'id': 1}, 'ok': True}}
        }