""" Test PATCH /gebruikers/<gebruikers_id> """
import json
from datetime import date

from models import Gebruiker


def test_gebruikers_detail_patch_success(client, gebruiker_factory):
    """ Test a succesfull PATCH on gebruikers_detail """
    gebruiker = gebruiker_factory.createGebruiker()
    edited_gebruiker = gebruiker
    edited_gebruiker.geboortedatum = date(1990, 1, 1)
    response = client.patch('/gebruikers/1',
                            data=json.dumps(edited_gebruiker.to_dict()), content_type='application/json')
    assert response.status_code == 200
    assert response.json["data"] == edited_gebruiker.to_dict()


def test_gebruikers_detail_patch_invalid_json(client, gebruiker_factory):
    """ Test a succesfull PATCH on gebruikers_detail """
    gebruiker = gebruiker_factory.createGebruiker()
    edited_gebruiker = gebruiker.to_dict()
    edited_gebruiker["geboortedatum"] = "02-05-2010"

    response = client.patch('/gebruikers/1',
                            data=json.dumps(edited_gebruiker), content_type='application/json')
    assert response.status_code == 400
    assert response.json["errors"][0] == (
        "'02-05-2010' does not match '^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$'"
    )
