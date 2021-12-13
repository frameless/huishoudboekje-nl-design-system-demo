import requests_mock
from hhb_backend.graphql import settings


def test_get_alarmen(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = {'data': {'alarmen': [{'id': '00943958-8b93-4617-aa43-669a9016aad9', 'isActive': False, 'gebruikerEmail': 'other@mail.nl', 'afspraak': {'id': 20}, 'datum': '2021-02-02', 'datumMargin': 1, 'bedrag': '12.34', 'bedragMargin': '56.78'}]}}
        afspraak_id = 20
        alarm1 = {
            "id": "00943958-8b93-4617-aa43-669a9016aad9",
            "gebruikerEmail": "other@mail.nl",
            "afspraakId": afspraak_id,
            "isActive": False,
            "datum": "2021-02-02",
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
                        gebruikerEmail
                        afspraak{
                            id
                        }
                        datum
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
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert fallback.call_count == 0
        assert response.json == expected

def test_get_alarm_by_id(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = {'data': {'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9', 'isActive': False, 'gebruikerEmail': 'other@mail.nl', 'afspraak': {'id': 20}, 'datum': '2021-02-02', 'datumMargin': 1, 'bedrag': '12.34', 'bedragMargin': '56.78'}}}
        alarm_id = "00943958-8b93-4617-aa43-669a9016aad9"
        afspraak_id = 20
        alarm1 = {
            "id": alarm_id,
            "gebruikerEmail": "other@mail.nl",
            "afspraakId": 20,
            "isActive": False,
            "datum": "2021-02-02",
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
                        gebruikerEmail
                        afspraak{
                            id
                        }
                        datum
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
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert fallback.call_count == 0
        assert response.json == expected