import requests_mock
from hhb_backend.graphql import settings


afspraak = {
    'id': 1,
    'omschrijving': "something",
    'bedag': "456.78",
    'credit': True,
    'valid_from': "2020-10-01",
    'valid_through': "2020-10-01",
    'rubriek_id': 1,
    'burger_id': 1,
    'afdeling_id': 4,
    'postadres_id': "a1ce81ca-4193-48dd-9a80-c75058a4b5a9",
    'tegen_rekening_id': 1,
    'zoektermen': ["test1", "test2"],
}

def test_update_afspraak(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = {'data': {
            'updateAfspraak': {
                'ok': True,
                'afspraak': {
                    'omschrijving': 'something',
                    'bedrag': None,
                    'credit': True,
                    'validFrom': '2020-10-01',
                    'validThrough': '2020-10-01',
                    'zoektermen': ["test1", "test2"]
                }
            }
        }}
        afspraakId = 1
        input = {
            "omschrijving": "gewijzigde omschrijving",
            "bedrag": "543.21",
            "credit": False,
            "validThrough": "",
            "zoektermen": ["test1", "test2"],
            "afdelingId": None,
            "postadresId": None,
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/1", status_code=200, json={ "data": afspraak})
        rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1", status_code=200, json={ "data": [afspraak]})
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201, json={"data": {"id": 1}})

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($afspraakId: Int!, $input: UpdateAfspraakInput!){
                        updateAfspraak(id: $afspraakId, input: $input){
                            ok
                            afspraak{
                                omschrijving
                                bedrag
                                credit
                                validFrom
                                validThrough
                                zoektermen
                            }
                        }
                    }
                    ''',
                "variables": {"afspraakId": afspraakId, "input": input}},
            content_type='application/json'
        )

        # assert
        assert rm1.call_count == 1
        assert rm2.call_count == 1
        assert rm3.call_count == 1
        assert fallback.call_count == 0
        assert response.json == expected
