import json
import pytest
from rapportage_service.repositories.banktransactieservice_repository import BanktransactieServiceRepository
import requests_mock


@pytest.mark.parametrize("transactions_ids", [[1,2,3], []])
def test_banktransactieservie_repository(transactions_ids):
    """ Test if banktransactieservice repository calls banktransactie service correctly and returns recieved data correctly"""
    with requests_mock.Mocker() as request_mocker:
        # ARRANGE
        sut = BanktransactieServiceRepository()

        expected_result = {
            "some_test_data" : 10,
            "some more test data": "test test test"
        }
        mock_response = {
            "data": expected_result
        }
        start_date = '2022-12-1'
        end_date = '2022-12-1'

        def additional_matcher(request):
            return request.text == json.dumps({"transaction_ids": transactions_ids})

        adapter = requests_mock.Adapter()
        adapter.register_uri('GET', f'/banktransactions/range?startDate={start_date}&endDate={end_date}', additional_matcher=additional_matcher, json=mock_response)
        request_mocker._adapter = adapter

        # # ACT
        result = sut.get_transacties_in_range(start_date, end_date, transactions_ids)

        # ASSERT
        assert result == expected_result
