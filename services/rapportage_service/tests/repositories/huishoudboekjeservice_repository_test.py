import requests_mock
from rapportage_service.repositories.huishoudboekjeservice_repository import HuishoudboekjeserviceRepository

def test_huishoudboekje_repository():
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
        burger_id = 12
        
        adapter = requests_mock.Adapter()
        adapter.register_uri('GET', f'/burgers/{burger_id}/transacties', json=mock_response)
        request_mocker._adapter = adapter

        # ACT
        result = sut.get_transactions_burger(burger_id)

        # ASSERT
        assert result == expected_result
