""" Test PATCH /gebruikers/<gebruikers_id> """
import json
from datetime import date
from models import Gebruiker
from core_service.utils import row2dict


def test_gebruikers_detail_patch_success(client, gebruiker_factory):
    """ Test a succesfull POST on gebruikers_detail """
    gebruiker = gebruiker_factory.createGebruiker()
    edited_gebruiker = gebruiker
    edited_gebruiker.geboortedatum = date(1990, 1, 1)
    response = client.post('/gebruikers/1',
                            data=json.dumps(row2dict(edited_gebruiker)), content_type='application/json')
    assert response.status_code == 200
    assert response.json["data"] == row2dict(edited_gebruiker)


def test_gebruikers_detail_patch_invalid_json(client, gebruiker_factory):
    """ Test a succesfull POST on gebruikers_detail """
    gebruiker = gebruiker_factory.createGebruiker()
    edited_gebruiker = row2dict(gebruiker)
    edited_gebruiker["geboortedatum"] = "02-05-2010"

    response = client.post('/gebruikers/1',
                            data=json.dumps(edited_gebruiker), content_type='application/json')
    assert response.status_code == 400
    assert response.json["errors"][0] == (
        "'02-05-2010' does not match '^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$'"
    )
