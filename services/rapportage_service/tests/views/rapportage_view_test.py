""" Test rapportage view """

def test_rapportage_view(client, rapportage_controller_mock):
    """ Test rapportage view """
    # ARRANGE
    burger_id = 12
    start_date = '2022-12-1'
    end_date = '2021-12-1'
    expected_response_json = {"test": "test"}
    expected_response_status_code = 200
    
    # ACT
    rapportage_controller_mock.get_rapportage_burger.return_value = (expected_response_json, expected_response_status_code)

    # ASSERT
    response = client.get(f'/rapportage/{burger_id}?startDate={start_date}&endDate={end_date}')
    assert response.status_code == expected_response_status_code
    assert response.json == expected_response_json
    assert rapportage_controller_mock.get_rapportage_burger.called
    rapportage_controller_mock.get_rapportage_burger.assert_called_with(str(burger_id),start_date,end_date)