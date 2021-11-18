import requests_mock
from hhb_backend.graphql import settings

afspraak = {
            'id': 1,
            'rubriek_id': 1,
            'burger_id': 1,
            'tegen_rekening_id': 1,
            'valid_from': "2020-10-01",
            'valid_through': "2020-10-01",
            'zoektermen': [
                "zoekterm1",
                "zoekterm2"
            ],
            'betaalinstructie': {
                "end_date": "2020-12-31",
                "start_date": "2020-01-01",
                "by_month_day": [
                    1
                ],
                "except_dates": []
            },
            'journaalposten': [1, 2]
        }

def test_delete_afspraak(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = {'data': {'deleteAfspraak': {'ok': True}}}

        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1", status_code=200, json={'data': [afspraak]})
        rm2 = rm.delete(f"{settings.HHB_SERVICES_URL}/afspraken/1", status_code=204, json={})
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201, json={"data": {"id": 1}})

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($id: Int!) {
                        deleteAfspraak(id: $id) {
                            ok
                        }
                    }
                    ''',
                "variables": {"id": 1}},
            content_type='application/json'
        )

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert fallback.called == 0
        assert response.json == expected


def test_delete_afspraak_zoekterm(client):
    with requests_mock.Mocker() as rm:
        # arrange
        afspraak_removed_zoekterm = {
            'id': 1,
            'rubriek_id': 1,
            'burger_id': 1,
            'tegen_rekening_id': 1,
            'valid_from': "2020-10-01",
            'valid_through': "2020-10-01",
            'zoektermen': [
                "zoekterm2"
            ],
            'betaalinstructie': {
                "end_date": "2020-12-31",
                "start_date": "2020-01-01",
                "by_month_day": [
                    1
                ],
                "except_dates": []
            },
            'journaalposten': [1, 2]
        }
        
        afspraakId = 1
        zoekterm = "zoekterm1"
        expected = {'data': {'deleteAfspraakZoekterm': {'ok': True}}}
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1", status_code=200, json={'data': [afspraak]})
        rm2 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/1", status_code=200, json={'data': afspraak_removed_zoekterm})
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_rekening=1", status_code=200, json={'data': [afspraak_removed_zoekterm]})
        rm4 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201, json={"data": {"id": 1}})

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($afspraakId: Int!, $zoekterm: String!) {
                        deleteAfspraakZoekterm(afspraakId: $afspraakId, zoekterm: $zoekterm) {
                            ok
                        }
                    }
                    ''',
                "variables": {"afspraakId": afspraakId, "zoekterm": zoekterm}},
            content_type='application/json'
        )

        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert rm4.called_once
        assert fallback.called == 0
        assert response.json == expected

def test_delete_afspraak_zoekterm_niet_gevonden(client):
    with requests_mock.Mocker() as rm:
        # arrange
        afspraak_removed_zoekterm = {
            'id': 1,
            'rubriek_id': 1,
            'burger_id': 1,
            'tegen_rekening_id': 1,
            'valid_from': "2020-10-01",
            'valid_through': "2020-10-01",
            'zoektermen': [],
            'betaalinstructie': {
                "end_date": "2020-12-31",
                "start_date": "2020-01-01",
                "by_month_day": [
                    1
                ],
                "except_dates": []
            },
            'journaalposten': [1, 2]
        }
        
        afspraakId = 1
        zoekterm = "zoekterm1"
        expected = 'Zoekterm not found in zoektermen of afspraak.'
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1", status_code=200, json={'data': [afspraak_removed_zoekterm]})

        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($afspraakId: Int!, $zoekterm: String!) {
                        deleteAfspraakZoekterm(afspraakId: $afspraakId, zoekterm: $zoekterm) {
                            ok
                        }
                    }
                    ''',
                "variables": {"afspraakId": afspraakId, "zoekterm": zoekterm}},
            content_type='application/json'
        )

        # assert
        print(f">> >> >> >> response: {response.json['errors']} ")
        for call in rm.request_history:
            print(f">> >> >> >> fallback: {call.method} {call.url} ")

        assert rm1.called_once
        assert fallback.called == 0
        assert expected in response.json['errors'][0]['message']