
import requests_mock
from freezegun import freeze_time
from hhb_backend.graphql import settings

def test_afspraken(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", json={'data': [{
            'id': 1,
        }]})
        response = client.post(
            "/graphql",
            data='{"query": "{ afspraken { id } }"}',
            content_type='application/json'
        )
        assert response.json == {'data': {
            'afspraken': [{
                'id': 1,
            }]
        }}

def test_afspraak_resolvers(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", json={'data': [{
            'id': 1,
            'rubriek_id': 1,
            'gebruiker_id': 1,
            'tegen_rekening_id': 1,
            'start_datum': "2020-10-01",
            'eind_datum': "2020-10-01",
            'interval': "P1Y2M3W4D",
            'organisatie_id': 1,
            'journaalposten': [1, 2]
            
        }]})
        rm.get(f"{settings.HHB_SERVICES_URL}/rubrieken/", json={'data': [{'id': 1}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/gebruikers/", json={'data': [{'id': 1}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/", json={'data': [{'id': 1}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/organisaties/", json={'data': [{'id': 1}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/", json={'data': [{'id': 1}, {'id': 2}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ afspraak(id:1) { rubriek { id } gebruiker { id } tegenRekening { id } organisatie { id } journaalposten { id } startDatum eindDatum interval { dagen weken maanden jaren }} }"}',
            content_type='application/json'
        )
        assert response.json == {'data': {
            'afspraak': {
                'startDatum': '2020-10-01',
                'eindDatum': '2020-10-01',
                'interval': {'dagen': 4, 'jaren': 1, 'maanden': 2, 'weken': 3},
                'rubriek': {'id': 1},
                'gebruiker': {'id': 1},
                'tegenRekening': {'id': 1},
                'organisatie': {'id': 1},
                'journaalposten': [{'id': 1}, {'id': 2}]
            }
        }}

def test_afspraak_empty_interval(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", json={'data': [{
            'id': 1,
            'interval': ""
        }]})
        response = client.post(
            "/graphql",
            data='{"query": "{ afspraken(ids:[1]) { interval { dagen weken maanden jaren }} }"}',
            content_type='application/json'
        )
        assert response.json == {'data': {
            'afspraken': [{
                'interval': {'dagen': 0, 'jaren': 0, 'maanden': 0, 'weken': 0},
            }]
        }}

@freeze_time("2020-01-01")
def test_afspraak_overschijvingen_planner_normal(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", json={'data': [{
            'id': 1,
            'interval': "P0Y1M0W0D",
            'start_datum': "2020-01-01",
            'aantal_betalingen': 10,
            'bedrag': 1011
        }]})
        response = client.post(
            "/graphql",
            json={"query": '''{ afspraken(ids:[1]) { overschrijvingen(startDatum: "2020-01-01", eindDatum: "2021-01-01") { datum bedrag status } } }'''},
            content_type='application/json'
        )
        print(response.json)
        assert response.json['data']['afspraken'][0]['overschrijvingen'] == [
            {'datum': '2020-01-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-02-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-03-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-04-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-05-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-06-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-07-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-08-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-09-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-10-01', 'bedrag': '1.02', 'status': 'VERWACHTING'}
        ]

@freeze_time("2020-01-01")
def test_afspraak_overschijvingen_planner_no_einddatum(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", json={'data': [{
            'id': 1,
            'interval': "P0Y1M0W0D",
            'start_datum': "2020-01-01",
            'aantal_betalingen': 10,
            'bedrag': 1011
        }]})
        response = client.post(
            "/graphql",
            json={"query": '''{ afspraken(ids:[1]) { overschrijvingen(startDatum: "2020-01-01") { datum bedrag status } } }'''},
            content_type='application/json'
        )
        print(response.json)
        assert response.json['data']['afspraken'][0]['overschrijvingen'] == [
            {'datum': '2020-01-01', 'bedrag': '1.01', 'status': 'VERWACHTING'}
        ]


@freeze_time("2020-01-01")
def test_afspraak_overschijvingen_planner_doorlopened(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", json={'data': [{
            'id': 1,
            'interval': "P0Y1M0W0D",
            'start_datum': "2020-01-01",
            'aantal_betalingen': 0,
            'bedrag': 101
        }]})
        response = client.post(
            "/graphql",
            json={"query": '''{ afspraken(ids:[1]) { overschrijvingen(startDatum: "2020-02-01", eindDatum: "2021-01-01") { datum bedrag status } } }'''},
            content_type='application/json'
        )
        print(response.json)
        assert response.json['data']['afspraken'][0]['overschrijvingen'] == [
            {'datum': '2020-02-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-03-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-04-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-05-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-06-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-07-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-08-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-09-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-10-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-11-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2020-12-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'datum': '2021-01-01', 'bedrag': '1.01', 'status': 'VERWACHTING'}
        ]
