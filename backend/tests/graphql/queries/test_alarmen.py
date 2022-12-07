import requests_mock
from hhb_backend.graphql import settings


def test_get_alarmen(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = {'data': {'alarmen': [{'id': '00943958-8b93-4617-aa43-669a9016aad9', 'isActive': False, 'afspraak': {'id': 20}, 'startDate': '2021-02-02', 'datumMargin': 1, 'bedrag': '12.34', 'bedragMargin': '56.78'}]}}
        afspraak_id = 20
        alarm1 = {
            "id": "00943958-8b93-4617-aa43-669a9016aad9",
            "afspraakId": afspraak_id,
            "isActive": False,
            "startDate": "2021-02-02",
            "datumMargin": 1,
            "bedrag": 1234,
            "bedragMargin": 5678
        }
        afspraak = {
            "id": afspraak_id
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", json={'data': [alarm1]})
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=20", status_code=200, json={"data": [afspraak]})


        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query test {
                    alarmen {
                        id
                        isActive
                        afspraak{
                            id
                        }
                        startDate
                        datumMargin
                        bedrag
                        bedragMargin
                    }
                }''',
            },
            content_type='application/json'
        )


        # assert
        print(f">> >> >> >> response: {response.json} ")
        for call in rm.request_history:
            print(f">> >> >> >> fallback: {call.method} {call.url} ")
        assert rm1.call_count == 1
        assert rm2.call_count == 1
        assert rm3.call_count == 1
        assert fallback.call_count == 0
        assert response.json == expected

def test_get_alarm_by_id(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = {'data': {'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9', 'isActive': False, 'afspraak': {'id': 20}, 'startDate': '2021-02-02', 'datumMargin': 1, 'bedrag': '12.34', 'bedragMargin': '56.78'}}}
        alarm_id = "00943958-8b93-4617-aa43-669a9016aad9"
        afspraak_id = 20
        alarm1 = {
            "id": alarm_id,
            "afspraakId": 20,
            "isActive": False,
            "startDate": "2021-02-02",
            "datumMargin": 1,
            "bedrag": 1234,
            "bedragMargin": 5678
        }
        afspraak = {
            "id": afspraak_id
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_ids={alarm_id}", json={"data":[alarm1]})
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=20", status_code=200, json={"data": [afspraak]})


        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query test($id:String!) {
                    alarm(id:$id) {
                        id
                        isActive
                        afspraak{
                            id
                        }
                        startDate
                        datumMargin
                        bedrag
                        bedragMargin
                    }
                }''',
                "variables": {"id": alarm_id}},
            content_type='application/json'
        )


        # assert
        print(f">> >> >> >> response: {response.json} ")
        for call in rm.request_history:
            print(f">> >> >> >> fallback: {call.method} {call.url} ")
        assert rm1.call_count == 1
        assert rm2.call_count == 1
        assert rm3.call_count == 1
        assert fallback.call_count == 0
        assert response.json == expected
