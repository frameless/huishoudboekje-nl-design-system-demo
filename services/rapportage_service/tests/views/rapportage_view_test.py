""" Test rapportage view """

def test_rapportage_view(client, rapportage_controller_mock):
    """ Test rapportage view """
    # ARRANGE
    burger_ids = [12]
    start_date = '2022-12-1'
    end_date = '2021-12-1'
    expected_response_json = {"burger_ids": burger_ids}
    expected_response_status_code = 200
    
    # ACT
    rapportage_controller_mock.get_rapportage.return_value = (expected_response_json, expected_response_status_code)

    # ASSERT
    response = client.get(f'/rapportage?startDate={start_date}&endDate={end_date}', json=expected_response_json)
    assert response.status_code == expected_response_status_code
    assert response.json == expected_response_json
    assert rapportage_controller_mock.get_rapportage.called
    rapportage_controller_mock.get_rapportage.assert_called_with(burger_ids,[],start_date,end_date)

def test_rapportage_view_with_rubrieken(client, rapportage_controller_mock):
    """ Test rapportage view """
    # ARRANGE
    burger_ids = [12]
    rubrieken = [1,2,23,4,5,5]
    start_date = '2022-12-1'
    end_date = '2021-12-1'
    expected_response_json = {"burger_ids": burger_ids, "filter_rubrieken": rubrieken}
    expected_response_status_code = 200
    
    # ACT
    rapportage_controller_mock.get_rapportage.return_value = (expected_response_json, expected_response_status_code)

    # ASSERT
    response = client.get(f'/rapportage?startDate={start_date}&endDate={end_date}', json=expected_response_json)
    assert response.status_code == expected_response_status_code
    assert response.json == expected_response_json
    assert rapportage_controller_mock.get_rapportage.called
    rapportage_controller_mock.get_rapportage.assert_called_with(burger_ids,rubrieken,start_date,end_date)