import pytest
import requests_mock
from freezegun import freeze_time
from hhb_backend.graphql import settings

# @pytest.mark.only
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
        assert response.status_code == 200
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
            'burger_id': 1,
            'tegen_rekening_id': 1,
            'valid_from': "2020-10-01",
            'valid_through': "2020-10-01",
            'betaalinstructie': {
    "end_date": "2020-12-31",
    "start_date": "2020-01-01",
    "by_month_day": [
        1
    ],
    "except_dates": []
},
            'organisatie_id': 1,
            'journaalposten': [1, 2]

        }]})
        rm.get(f"{settings.HHB_SERVICES_URL}/rubrieken/", json={'data': [{'id': 1}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/burgers/", json={'data': [{'id': 1}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/rekeningen/", json={'data': [{'id': 1}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/organisaties/", json={'data': [{'id': 1}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/", json={'data': [{'id': 1}, {'id': 2}]})
        response = client.post(
            "/graphql",
            data='{"query": "{ afspraak(id:1) { rubriek { id } burger { id } tegenRekening { id } organisatie { id } journaalposten { id } validFrom validThrough betaalinstructie { byMonthDay endDate startDate exceptDates }} }"}',
            content_type='application/json'
        )
        assert response.json == {'data': {'afspraak': {'betaalinstructie': {'byMonthDay': [1],
                                            'endDate': '2020-12-31',
                                            'exceptDates': [],
                                            'startDate': '2020-01-01'},
                       'burger': {'id': 1},
                       'journaalposten': [{'id': 1}, {'id': 2}],
                       'organisatie': {'id': 1},
                       'rubriek': {'id': 1},
                       'tegenRekening': {'id': 1},
                       'validFrom': '2020-10-01',
                       'validThrough': '2020-10-01'}}}


def test_afspraak_empty_interval(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", json={'data': [{
            'id': 1,
            'betaalinstructie': ""
        }]})
        response = client.post(
            "/graphql",
            data='{"query": "{ afspraken(ids:[1]) { betaalinstructie { byMonthDay endDate startDate exceptDates }} }"}',
            content_type='application/json'
        )
        assert response.json == {'data': {'afspraken': [{'betaalinstructie': {'byMonthDay': [],
                                              'endDate': None,
                                              'exceptDates': [],
                                              'startDate': None}}]}}


@freeze_time("2020-01-01")
def test_afspraak_overschrijvingen_planner_normal(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", json = {'data': [{
            'id': 1,
            'betaalinstructie': {
    "end_date": "2020-10-31",
    "start_date": "2020-01-01",
    "by_month_day": [
        1
    ],
    "except_dates": []
},
            'valid_from': "2020-01-01",
            'bedrag': 101
        }]})
        rm.get(f"{settings.HHB_SERVICES_URL}/overschrijvingen/?filter_afspraken=1", json={'data': [
            {
                'id': 1,
                "afspraak_id": 1,
                'datum': "2020-01-01",
                'bedrag': 101,
                'export_id': 1,
                'bank_transaction_id': 1
            },
            {
                'id': 2,
                "afspraak_id": 1,
                'datum': "2020-02-01",
                'bedrag': 101,
                'export_id': 2,
                'bank_transaction_id': None
            }
        ]})
        response = client.post(
            "/graphql",
            json={
                "query": '''{ afspraken(ids:[1]) { overschrijvingen(startDatum: "2020-01-01", eindDatum: "2020-11-01") { datum bedrag status afspraak { id } } } }'''},
            content_type='application/json'
        )
        assert response.json['data']['afspraken'][0]['overschrijvingen'] == [
            {'afspraak': {'id': 1}, 'datum': '2020-01-01', 'bedrag': '1.01', 'status': 'GEREED'},
            {'afspraak': {'id': 1}, 'datum': '2020-02-01', 'bedrag': '1.01', 'status': 'IN_BEHANDELING'},
            {'afspraak': {'id': 1}, 'datum': '2020-03-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'afspraak': {'id': 1}, 'datum': '2020-04-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'afspraak': {'id': 1}, 'datum': '2020-05-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'afspraak': {'id': 1}, 'datum': '2020-06-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'afspraak': {'id': 1}, 'datum': '2020-07-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'afspraak': {'id': 1}, 'datum': '2020-08-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'afspraak': {'id': 1}, 'datum': '2020-09-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'afspraak': {'id': 1}, 'datum': '2020-10-01', 'bedrag': '1.01', 'status': 'VERWACHTING'},
            {'afspraak': {'id': 1}, 'datum': '2020-11-01', 'bedrag': '1.01', 'status': 'VERWACHTING'}
        ]


@freeze_time("2020-01-01")
def test_afspraak_overschrijvingen_planner_no_einddatum(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", json={'data': [{
            'id': 1,
            'betaalinstructie': {
    "start_date": "2020-01-01",
    "by_month_day": [
        1
    ],
    "except_dates": []
},
            'valid_from': "2020-01-01",
            'aantal_betalingen': 10,
            'bedrag': 1011
        }]})
        rm.get(f"{settings.HHB_SERVICES_URL}/overschrijvingen/?filter_afspraken=1", json={'data': [
            {
                'id': 1,
                "afspraak_id": 1,
                'datum': "2020-01-01",
                'bedrag': 101,
                'export_id': 1,
                'bank_transaction_id': 1
            },
            {
                'id': 2,
                "afspraak_id": 1,
                'datum': "2020-02-01",
                'bedrag': 101,
                'export_id': 2,
                'bank_transaction_id': None
            }
        ]})
        response = client.post(
            "/graphql",
            json={
                "query": '''{ afspraken(ids:[1]) { overschrijvingen(startDatum: "2020-01-01") { datum bedrag status } } }'''},
            content_type='application/json'
        )
        print(response.json)
        assert response.json['data']['afspraken'][0]['overschrijvingen'] == [
            {'datum': '2020-01-01', 'bedrag': '1.01', 'status': 'GEREED'}
        ]


@freeze_time("2020-01-01")
def test_afspraak_overschrijvingen_planner_doorlopened(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/", json={'data': [{
            'id': 1,
            'betaalinstructie': {
    "start_date": "2020-01-01",
    "by_month_day": [
        1
    ],
    "except_dates": []
},
            'valid_from': "2020-01-01",
            'aantal_betalingen': 0,
            'bedrag': 101
        }]})
        rm.get(f"{settings.HHB_SERVICES_URL}/overschrijvingen/?filter_afspraken=1", json={'data': [
            {
                'id': 1,
                "afspraak_id": 1,
                'datum': "2020-01-01",
                'bedrag': 101,
                'export_id': 1,
                'bank_transaction_id': 1
            },
            {
                'id': 2,
                "afspraak_id": 1,
                'datum': "2020-02-01",
                'bedrag': 101,
                'export_id': 2,
                'bank_transaction_id': None
            }
        ]})
        response = client.post(
            "/graphql",
            json={
                "query": '''{ afspraken(ids:[1]) { overschrijvingen(startDatum: "2020-02-01", eindDatum: "2021-01-01") { datum bedrag status } } }'''},
            content_type='application/json'
        )
        print(response.json)
        assert response.json['data']['afspraken'][0]['overschrijvingen'] == [
            {'datum': '2020-02-01', 'bedrag': '1.01', 'status': 'IN_BEHANDELING'},
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
