""" Test saldo view """

import logging


def test_saldo_view_correct(client, saldo_controller_mock):
    """ Test rapportage view """
    # ARRANGE
    burger_ids = [12]
    expected_saldo=1235345
    date = '2022-12-01'
    request_json = {"burger_ids": burger_ids}
    expected_response_json = {"saldo": expected_saldo}
    expected_response_status_code = 200
    saldo_controller_mock.get_saldos.return_value = expected_response_json

    # ACT
    response = client.get(f'/saldo?date={date}', json=request_json)
    # ASSERT
    assert response.status_code == expected_response_status_code
    assert response.json["data"] == expected_response_json
    assert saldo_controller_mock.get_saldos.called
    saldo_controller_mock.get_saldos.assert_called_with(burger_ids,date)

def test_saldo_view_invalid_date(client, saldo_controller_mock):
    """ Test rapportage view """
    # ARRANGE
    burger_ids = [12]
    expected_saldo=1235345
    date = '2022-31-31'
    request_json = {"burger_ids": burger_ids}
    expected_response_json = {"saldo": expected_saldo}
    expected_response_status_code = 400
    saldo_controller_mock.get_saldos.return_value = expected_response_json

    # ACT
    response = client.get(f'/saldo?date={date}', json=request_json)

    logging.error(saldo_controller_mock.get_saldos.called)
    # ASSERT
    assert response.status_code == expected_response_status_code
    assert "invalid date" in str(response.json)

def test_saldo_view_no_date(client, saldo_controller_mock):
    """ Test rapportage view """
    # ARRANGE
    burger_ids = [12]
    expected_saldo=1235345
    date = None
    request_json = {"burger_ids": burger_ids}
    expected_response_json = {"saldo": expected_saldo}
    expected_response_status_code = 400
    saldo_controller_mock.get_saldos.return_value = expected_response_json

    # ACT
    response = client.get(f'/saldo?date={date}', json=request_json)
    # ASSERT
    assert response.status_code == expected_response_status_code
    assert "invalid date" in str(response.json)