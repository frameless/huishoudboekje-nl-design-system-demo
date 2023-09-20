import requests_mock
from rapportage_service.repositories.huishoudboekjeservice_repository import HuishoudboekjeserviceRepository

def test_get_transactions_burgers():
    """ Test if hhbservice repository calls hhb service and returns recieved data correctly"""
    with requests_mock.Mocker() as request_mocker:
        # ARRANGE
        sut = HuishoudboekjeserviceRepository()

        expected_result = {
            "some_test_data" : 10,
            "some more test data": "test test test"
        }
        mock_response = {
            "data": expected_result
        }
        burger_ids = [12]
        rubrieken = []
        
        adapter = requests_mock.Adapter()
        adapter.register_uri('GET', f'/burgers/transacties', json=mock_response)
        request_mocker._adapter = adapter

        # ACT
        result = sut.get_transactions_burgers(burger_ids, rubrieken)

        # ASSERT
        assert result == expected_result

def test_get_transaction_ids_burgers():
    """ Test if hhbservice repository calls hhb service and returns recieved data correctly"""
    with requests_mock.Mocker() as request_mocker:
        # ARRANGE
        sut = HuishoudboekjeserviceRepository()

        expected_result = [
            {"transaction_id" : 10},
            {"transaction_id" : 1},
            {"transaction_id" : 20},
            {"transaction_id" : 13}
        ]
        mock_response = {
            "data": expected_result
        }
        burger_ids = [12]
        
        adapter = requests_mock.Adapter()
        adapter.register_uri('GET', f'/burgers/transacties/ids', json=mock_response)
        request_mocker._adapter = adapter

        # ACT
        result = sut.get_transaction_ids_burgers(burger_ids)

        # ASSERT
        assert result == expected_result

