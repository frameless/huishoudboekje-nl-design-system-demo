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
    'tegen_rekening_id': 1,
    'zoektermen': [],
}

def test_update_afspraak(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = {'data': {'updateAfspraak': {'ok': True, 'afspraak': {'omschrijving': 'something', 'bedrag': None, 'credit': True, 'validFrom': '2020-10-01', 'validThrough': '2020-10-01'}}}}
        afspraakId = 1
        input = {
            "omschrijving": "gewijzigde omschrijving",
            "bedrag":"543.21",
            "credit": False,
            "validThrough": ""
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
                            }
                        }
                    }
                    ''',
                "variables": {"afspraakId": afspraakId, "input": input}},
            content_type='application/json'
        )

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert fallback.called == 0
        assert response.json == expected