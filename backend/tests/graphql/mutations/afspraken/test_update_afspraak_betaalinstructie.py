import requests_mock
from hhb_backend.graphql import settings
from hhb_backend.graphql.scalars.day_of_week import DayOfWeek

afspraak = {
    "id": 1,
    "omschrijving": "huur",
    "bedrag": "650.00",
    "credit": False,
    "valid_from": "2021-11-12",
    "valid_through": None,
    # leave out complex references
    "betaalinstructie": {
        "by_day": [ 
            "Monday",
            "Wednesday",
            "Friday"], 
        "by_month": [],
        "by_month_day": [],
        "repeat_frequency": None,
        "except_dates": None,
        "start_date": "2020-01-01",
        "end_date": "2022-01-01",
    }
}

afspraak_inkomsten = {
    "id": 1,
    "omschrijving": "huur",
    "bedrag": "650.00",
    "credit": True,
    "valid_from": "2021-11-12",
    "valid_through": None,
    # leave out complex references
}

def test_update_afspraak(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = {'data': {'updateAfspraakBetaalinstructie': {'ok': True, 'afspraak': {'id': 1, 'omschrijving': 'huur', 'bedrag': '6.50', 'credit': False, 'validFrom': '2021-11-12', 'validThrough': None, 'betaalinstructie': {'byDay': [], 'byMonth': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 'byMonthDay': [], 'repeatFrequency': None, 'exceptDates': [], 'startDate': '2020-11-01', 'endDate': '2022-11-01'}}, 'previous': {'id': 1, 'omschrijving': 'huur', 'bedrag': '6.50', 'credit': False, 'validFrom': '2021-11-12', 'validThrough': None, 'betaalinstructie': {'byDay': ['Monday', 'Wednesday', 'Friday'], 'byMonth': [], 'byMonthDay': [], 'repeatFrequency': None, 'exceptDates': None, 'startDate': '2020-01-01', 'endDate': '2022-01-01'}}}}}
        updated_afspraak = {
            "id": 1,
            "omschrijving": "huur",
            "bedrag": "650.00",
            "credit": False,
            "valid_from": "2021-11-12",
            "valid_through": None,
            "betaalinstructie": {
                "by_day": [], 
                "by_month": [1,2,3,4,5,6,7,8,9,10,11,12], 
                "by_monthDay": [3],
                "repeat_frequency": None,
                "except_dates": [],
                "start_date": "2020-11-01",
                "end_date": "2022-11-01"
            }
        }
        afspraakId = 1
        betaalInstructieInput = {
            "startDate":"2020-11-01",
            "endDate":"2022-11-01",
            "byMonth": [1,2,3,4,5,6,7,8,9,10,11,12],
            "byMonthDay": [3],
            "byDay": [],
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1", status_code=200, json={ "data": [afspraak]})
        rm2 = rm.post(f"{settings.HHB_SERVICES_URL}/afspraken/1", status_code=200, json={ "data": updated_afspraak})
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201, json={"data": {"id": 1}})


        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($afspraakId: Int!, $input: BetaalinstructieInput!){
                        updateAfspraakBetaalinstructie(afspraakId: $afspraakId, betaalinstructie: $input){
                            ok
                            afspraak{
                                id
                                omschrijving
                                bedrag
                                credit
                                validFrom
                                validThrough
                                betaalinstructie{
                                    byDay
                                    byMonth
                                    byMonthDay
                                    repeatFrequency
                                    exceptDates
                                    startDate
                                    endDate
                                }
                            }
                            previous{
                                id
                                omschrijving
                                bedrag
                                credit
                                validFrom
                                validThrough
                                betaalinstructie{
                                    byDay
                                    byMonth
                                    byMonthDay
                                    repeatFrequency
                                    exceptDates
                                    startDate
                                    endDate
                                }
                            }
                        }
                    }
                    ''',
                "variables": {"afspraakId": afspraakId, "input": betaalInstructieInput}},
            content_type='application/json'
        )


        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert fallback.called == 0
        assert response.json == expected

def test_update_afspraak_does_not_exist(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = "afspraak not found"
        betaalInstructieInput = {
            "startDate":"2020-11-01",
            "endDate":"2022-11-01",
            "byMonth": [1,2,3,4,5,6,7,8,9,10,11,12],
            "byMonthDay": [3],
            "byDay": [],
        }
        afspraakId = 1
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1", status_code=200, json={ "data": []})


        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($afspraakId: Int!, $input: BetaalinstructieInput!){
                        updateAfspraakBetaalinstructie(afspraakId: $afspraakId, betaalinstructie: $input){
                            ok
                        }
                    }
                    ''',
                "variables": {"afspraakId": afspraakId, "input": betaalInstructieInput}},
            content_type='application/json')


        # assert
        assert rm1.called_once
        assert fallback.called == 0
        assert expected in response.json['errors'][0]['message']


def test_update_afspraak_is_credit(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = "Betaalinstructie is alleen mogelijk bij uitgaven"
        betaalInstructieInput = {
            "startDate":"2020-11-01",
            "endDate":"2022-11-01",
            "byMonth": [1,2,3,4,5,6,7,8,9,10,11,12],
            "byMonthDay": [3],
            "byDay": [],
        }
        afspraakId = 1
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1", status_code=200, json={ "data": [afspraak_inkomsten]})


        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($afspraakId: Int!, $input: BetaalinstructieInput!){
                        updateAfspraakBetaalinstructie(afspraakId: $afspraakId, betaalinstructie: $input){
                            ok
                        }
                    }
                    ''',
                "variables": {"afspraakId": afspraakId, "input": betaalInstructieInput}},
            content_type='application/json')


        # assert
        assert rm1.called_once
        assert fallback.called == 0
        assert expected in response.json['errors'][0]['message']

def test_update_afspraak_invalid_betaalinstructie(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = "Betaalinstructie: 'by_day' of 'by_month_day' moet zijn ingevuld"
        # invalid because you provide either byMonth + byMonthDay or byDay - not both
        betaalInstructieInput = {
            "startDate":"2020-11-01",
            "endDate":"2022-11-01",
            "byMonth": [1,2,3,4,5,6,7,8,9,10,11,12],
            "byMonthDay": [3],
            "byDay": [ 
                "Monday",
                "Wednesday",
                "Friday"], 
        }
        afspraakId = 1
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1", status_code=200, json={ "data": [afspraak]})


        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($afspraakId: Int!, $input: BetaalinstructieInput!){
                        updateAfspraakBetaalinstructie(afspraakId: $afspraakId, betaalinstructie: $input){
                            ok
                        }
                    }
                    ''',
                "variables": {"afspraakId": afspraakId, "input": betaalInstructieInput}},
            content_type='application/json')


        # assert
        assert rm1.called_once
        assert fallback.called == 0
        assert expected in response.json['errors'][0]['message']

def test_update_afspraak_invalid_date_range(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = "Begindatum moet voor einddatum liggen"
        betaalInstructieInput = {
            "startDate":"2022-11-01",
            "endDate":"2020-11-01",
            "byMonth": [1,2,3,4,5,6,7,8,9,10,11,12],
            "byMonthDay": [3],
            "byDay": [], 
        }
        afspraakId = 1
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1", status_code=200, json={ "data": [afspraak]})


        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($afspraakId: Int!, $input: BetaalinstructieInput!){
                        updateAfspraakBetaalinstructie(afspraakId: $afspraakId, betaalinstructie: $input){
                            ok
                        }
                    }
                    ''',
                "variables": {"afspraakId": afspraakId, "input": betaalInstructieInput}},
            content_type='application/json')


        # assert
        assert rm1.called_once
        assert fallback.called == 0
        assert expected in response.json['errors'][0]['message']