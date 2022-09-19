""" Test GET /export/(<export_id>/) """
from models.export import Export
from urllib.parse import urlencode

def test_export_get_success_multiple(client, export_factory):
    """ Test /export/ path """
    export1 = export_factory.createExport(naam="export.1.pain")
    export2 = export_factory.createExport(naam="export.2.pain")
    response = client.get(f'/export/')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["naam"] == export1.naam
    assert response.json["data"][1]["naam"] == export2.naam

def test_export_get_success_single(client, export_factory):
    """ Test /export/ path """
    export1 = export_factory.createExport(naam="Export1")
    export2 = export_factory.createExport(naam="Export2")
    response = client.get(f'/export/{export2.id}')
    assert response.status_code == 200
    assert response.json["data"]["naam"] == export2.naam

def test_export_get_failure_not_found(client):
    response = client.get('/export/1337')
    assert response.status_code == 404
    assert response.json["errors"][0] == "Export not found."

def test_export_filter_columns(client, export_factory):
    export1 = export_factory.createExport(naam="Export1")
    export2 = export_factory.createExport(naam="Export2")
    response = client.get('/export/?columns=id,naam')
    assert response.status_code == 200
    assert response.json["data"] == [
        {"id": export1.id, "naam": export1.naam},
        {"id": export2.id, "naam": export2.naam}
    ]
    response = client.get(f'/export/{export2.id}?columns=id,naam')
    assert response.status_code == 200
    assert response.json["data"] == {"id": export2.id, "naam": export2.naam}

def test_export_filter_invalid_column(client):
    response = client.get('/export/?columns=non-field')
    assert response.status_code == 400
    assert response.json["errors"][0] == "Input for columns is not correct, 'non-field' is not a column."

def test_export_filter_ids(client, export_factory):
    export1 = export_factory.createExport(naam="Export1")
    export2 = export_factory.createExport(naam="Export2")
    response = client.get(f'/export/?filter_ids={export1.id},{export2.id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["naam"] == export1.naam
    assert response.json["data"][1]["naam"] == export2.naam
    response = client.get(f'/export/?filter_ids={export1.id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["naam"] == export1.naam
    response = client.get(f'/export/?filter_ids={export2.id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["naam"] == export2.naam

def test_export_filter_invalid_id(client):
    response = client.get(f'/export/?filter_ids=NaN')
    assert response.status_code == 200
    assert response.json["data"] == []

def test_export_get_filter_naam(client, export_factory):
    export1 = export_factory.createExport( naam="Export-1.1")
    export2 = export_factory.createExport( naam="Export-1.2")
    export3 = export_factory.createExport( naam="Export-2.3")

    response = client.get(f'/export/?{urlencode(dict(filter_naam="Export-1."))}')
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["naam"] == export1.naam
    assert response.json["data"][1]["naam"] == export2.naam

    response = client.get(f'/export/?filter_naam=2')
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["naam"] == export2.naam
    assert response.json["data"][1]["naam"] == export3.naam


