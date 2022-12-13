""" Test PATCH /burgers/<burgers_id> """
import json
from datetime import date

from core_service.utils import row2dict


def test_burgers_detail_patch_success(client, burger_factory):
    """ Test a succesfull POST on burgers_detail """
    burger = burger_factory.createBurger()
    edited_burger = burger
    edited_burger.geboortedatum = date(1990, 1, 1)
    edited_burger.bsn = 223456789
    response = client.post('/burgers/1',
                           data=json.dumps(row2dict(edited_burger)), content_type='application/json')
    assert response.status_code == 200
    assert response.json["data"] == row2dict(edited_burger)


def test_burgers_detail_patch_invalid_json(client, burger_factory):
    """ Test a succesfull POST on burgers_detail """
    edited_burger = {"geboortedatum": "02-05-2010"}

    response = client.post('/burgers/1',
                           data=json.dumps(edited_burger), content_type='application/json')
    assert response.status_code == 400
    assert response.json["errors"][0] == (
        "'02-05-2010' does not match '^(?:[0-9]{4}-[0-9]{2}-[0-9]{2}|)$'"
    )

def test_burgers_detail_patch_optional_email_telefoonnummer(client, burger_factory):
    burger = burger_factory.createBurger()
    edited_burger = burger
    edited_burger.bsn = 223456786
    edited_burger.email = None
    edited_burger.telefoonnummer = None

    response = client.post('/burgers/1',
                           data=json.dumps(row2dict(edited_burger)), content_type='application/json')
    assert response.status_code == 200
    assert response.json["data"] == row2dict(edited_burger)
