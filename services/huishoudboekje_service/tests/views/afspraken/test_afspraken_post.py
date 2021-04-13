""" Test POST /afspraken/(<afspraak_id>/) """
import json
from datetime import date
import pytest
from models.afspraak import Afspraak


def test_afspraken_post_new_afspraak(client, session):
    """ Test /afspraken/ path """
    assert session.query(Afspraak).count() == 0
    afspraak_dict = {
        "omschrijving": "Nieuwe afspraak",
        "start_datum": date(2020, 10, 1).isoformat(),
        "eind_datum": date(2020, 10, 1).isoformat(),
        "aantal_betalingen": 5,
        "interval": "P1Y2M10DT2H30M",
        "bedrag": 1337,
        "credit": True,
        "zoektermen": ["ABC1234"],
        "automatische_incasso": True,
        "automatisch_boeken": False
    }
    response = client.post(
        '/afspraken/',
        data=json.dumps(afspraak_dict),
        content_type='application/json'
    )
    assert response.status_code == 201
    afspraak_dict["id"] = 1
    afspraak_dict["burger_id"] = None
    afspraak_dict["tegen_rekening_id"] = None
    afspraak_dict["organisatie_id"] = None
    afspraak_dict["rubriek_id"] = None
    assert response.json["data"] == afspraak_dict
    assert session.query(Afspraak).count() == 1


def test_afspraken_post_update_afspraak(client, session, afspraak_factory):
    """ Test /afspraken/<afspraak_id> path """
    afspraak = afspraak_factory.createAfspraak(bedrag=1.1, omschrijving="Test Afspraak")
    update_dict = {
        "bedrag": 220,
        "omschrijving": "Test Afspraak edited"
    }
    response = client.post(
        f'/afspraken/{afspraak.id}',
        data=json.dumps(update_dict),
        content_type='application/json'
    )
    assert response.status_code == 200
    assert response.json["data"]["bedrag"] == update_dict["bedrag"] == afspraak.bedrag
    assert response.json["data"]["omschrijving"] == update_dict["omschrijving"] == afspraak.omschrijving
    response = client.post(
        f'/afspraken/1337',
        data=json.dumps(update_dict),
        content_type='application/json'
    )
    assert response.status_code == 404


@pytest.mark.parametrize("key,bad_value", [
    ("burger_id", "Kareltje"),
    ("omschrijving", 1234),
    ("start_datum", 1234),
    ("eind_datum", 1234),
    ("aantal_betalingen", "5"),
    ("interval", 1234),
    ("bedrag", "13,37"),
    ("credit", "True"),
    ("zoektermen", ""),
    ("zoektermen", {}),
    ("zoektermen", [True]),
    ("zoektermen", [1234]),
    ("zoektermen", [""]),
    ("zoektermen", [" "]),
    ("zoektermen", ["a", "a"])
])
def test_afspraken_post_bad_requests(client, key, bad_value):
    """ Test /afspraken/ path bad request """
    bad_data = {key: bad_value}
    response = client.post(
        f'/afspraken/',
        data=json.dumps(bad_data),
        content_type='application/json'
    )
    assert response.status_code == 400
