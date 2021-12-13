import requests_mock
from hhb_backend.graphql import settings

def test_delete_alarm(client):
    with requests_mock.Mocker() as rm:
        # arrange
        expected = {'data': {'deleteAlarm': {'ok': True}}}
        alarm_id = "00943958-8b93-4617-aa43-669a9016aad9"
        alarm1 = {
            "id": alarm_id,
            "gebruikerEmail": "other@mail.nl",
            "afspraakId": 20,
            "status": "Inactive",
            "datum": "2021-02-02",
            "datumMargin": 1,
            "bedrag": 1234,
            "bedragMargin": 5678
        }
        fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
        rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/?filter_ids={alarm_id}", status_code=200, json={"data":[alarm1]})
        rm2 = rm.delete(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm_id}", status_code=204, json={})
        rm3 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201, json={"data": {"id": 1}})


        # act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                    mutation test($id: String!) {
                        deleteAlarm(id: $id) {
                            ok
                        }
                    }
                    ''',
                "variables": {"id": alarm_id}},
            content_type='application/json'
        )


        # assert
        assert rm1.called_once
        assert rm2.called_once
        assert rm3.called_once
        assert fallback.called == 0
        assert response.json == expected