import requests_mock
from sepaxml import SepaDD, SepaTransfer
import datetime, uuid


def test_create_export_success(client):
    #with requests_mock.Mocker() as mock:
        #mock._adapter = create_mock_adapter()
    response = client.post(
        "/graphql",
        json={
            "query": '''
    mutation createExportOverschrijvingen($startDatum: String, 
    $eindDatum: String) {
      createExportOverschrijvingen(startDatum: $startDatum, eindDatum:$eindDatum) {
        ok
        export
      }
    }''',
            "variables": {'startDatum': '2020-10-10',
                          'eindDatum': '2020-12-31'}},
        content_type='application/json'
    )
    #assert mock._adapter.call_count == 1
    assert response.json["data"]["updateGebruiker"]["ok"] is True
