""" Test POST /export/(<export_id>/) """
import json
from datetime import datetime

from dateutil import tz
import pytest
from models.export import Export

def test_exports_post_new_export(client, session):
    """ Test /export/ path """
    assert session.query(Export).count() == 0
    export_dict = {
        "naam":"Nieuwe export",
        "timestamp":datetime(2020, 10, 1, tzinfo=tz.tzlocal()).isoformat(),
    }
    response = client.post('/export/', json=export_dict)
    assert response.status_code == 201

    export_dict["id"] = 1
    assert response.json["data"] == export_dict
    assert session.query(Export).count() == 1

@pytest.mark.parametrize("export, status_code", [
    (dict(naam="export.some", timestamp=None), 409),
    (dict(naam=None, timestamp=datetime.utcnow().isoformat()), 400),
])
def test_exports_post_new_export_missing_data(client, session, export, status_code):
    """ Test /export/ path """
    response = client.post('/export/', json=export)
    assert response.status_code == status_code

def test_exports_post_update_export(client, session, export_factory):
    """ Test /export/<export_id> path """
    export = export_factory.createExport(naam="export")
    update_dict = dict(naam="export.pain")
    response = client.post(f'/export/{export.id}', json=update_dict)
    assert response.status_code == 200
    assert response.json["data"]["naam"] == update_dict["naam"] == export.naam

def test_exports_post_update_export_bad_id(client, session, export_factory):
    export_factory.createExport(naam="export")
    update_dict = dict(naam="export.pain")
    response = client.post(f'/export/1337', json=update_dict)
    assert response.status_code == 404

@pytest.mark.parametrize("key,bad_value", [
    ("timestamp", "Kareltje"),
    ("timestamp", 1234),
])
def test_exports_post_bad_requests(client, key, bad_value):
    """ Test /export/ path bad request """
    bad_data = {key: bad_value}
    response = client.post(
        f'/export/',
        data=json.dumps(bad_data),
        content_type='application/json'
    )
    assert response.status_code == 400
