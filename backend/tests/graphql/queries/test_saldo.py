import requests_mock
from hhb_backend.graphql import settings

def test_saldo_burger(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_burgers=1", json={"data": [{'id': 1, 'burger_id':1}]})
        rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_afspraken=1", json={'data': [{'id':1, 'afspraak_id':1, 'transaction_id':1}, {'id':2, 'afspraak_id':1, 'transaction_id':2}]})
        rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/saldo/1,2", json={'data': {'bedrag': 12300}})
        rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query test($burgerIds:[Int]) {
                    saldo(burgerIds:$burgerIds){
                        bedrag
                    }
                }
                ''',
                "variables":{"burgerIds":[1]}
            },
            content_type='application/json'
        )
        print(response.json)
        assert response.json == {'data': {'saldo' :{'bedrag': "123.00"}}}
    


def test_saldo_totaal(client):
    with requests_mock.Mocker() as rm:
        rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/saldo/", json={'data': {'bedrag':45600}})
        rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query {
                    saldo(burgerIds:[]){
                        bedrag
                    }
                }
                ''',
            },
            content_type='application/json'
        )
        print(response.json)
        assert response.json == {'data':{'saldo': {'bedrag': "456.00"}}}
