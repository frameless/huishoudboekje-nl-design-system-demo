""" Test POST /afspraken/(<afspraak_id>/) """
import json
from datetime import date
import pytest
from models.afspraak import Afspraak

def test_afspraken_post_new_afspraak_minimum(client, session):
    """ Test /afspraken/ path """
    assert session.query(Afspraak).count() == 0
    afspraak_dict_min = {
        "omschrijving": "Nieuwe afspraak",
        "valid_from": date(2020, 10, 1).isoformat(),
        "valid_through": date(2020, 10, 1).isoformat(),
        "aantal_betalingen": 5,
        "betaalinstructie": {
            "byDay": [1,2],
            "byMonth": [3,4],
            "byMonthDay": [],
            "byMonthWeek": [],
            "exceptDates": [],
            "startDatum": "2021-01-01",
            "eindDatum": "2021-12-31",

        },
        "bedrag": 1337,
        "credit": True,
        "zoektermen": ["ABC1234"],
    }
    response = client.post(
        '/afspraken/',
        data=json.dumps(afspraak_dict_min),
        content_type='application/json'
    )
    assert response.status_code == 201
    afspraak_dict_min["id"] = 1
    afspraak_dict_min["burger_id"] = None
    afspraak_dict_min["tegen_rekening_id"] = None
    afspraak_dict_min["afdeling_id"] = None
    afspraak_dict_min["postadres_id"] = None
    afspraak_dict_min["alarm_id"] = None
    afspraak_dict_min["rubriek_id"] = None
    assert response.json["data"] == afspraak_dict_min
    assert session.query(Afspraak).count() == 1

def test_afspraken_post_new_afspraak_full(client, session, 
    burger_factory,
     rubriek_factory, 
     rekening_factory,
    #  afdeling_factory
     ):

    """ Test /afspraken/ path """
    assert session.query(Afspraak).count() == 0
    burger_factory.createBurger()
    rubriek_factory.create_rubriek()
    rekening_factory.create_rekening()
    # afdeling_factory.create_afdeling() > cant find it, TODO fix

    afspraak_dict_full = {
        "burger_id": 1,
        "omschrijving": "Nieuwe afspraak full",
        "valid_from": date(2020, 10, 1).isoformat(),
        "valid_through": date(2022, 10, 1).isoformat(),
        "aantal_betalingen": 5,
        "rubriek_id": 1,
        "tegen_rekening_id": 1,
        "bedrag": 1337,
        "credit": True,
        "zoektermen": ["ABC1234"],
        # journaalposten
        # overschrijvingen
        # "afdeling_id": 1,
        "postadres_id": "38d25c77-8cd5-4bbe-9a73-633ec7847794",
        "alarm_id": "38d25c77-8cd5-4bbe-9a73-633ec7847795",
        "betaalinstructie": {
            "byDay": [1,2],
            "byMonth": [3,4],
            "byMonthDay": [],
            "byMonthWeek": [],
            "exceptDates": ["2021-02-02", "2021-03-03"],
            "startDatum": "2021-01-01",
            "eindDatum": "2021-12-31",

        },
        
    }
    response = client.post(
        '/afspraken/',
        data=json.dumps(afspraak_dict_full),
        content_type='application/json'
    )
    assert response.status_code == 201
    afspraak_dict_full["id"] = 1
    afspraak_dict_full["burger_id"] = 1
    afspraak_dict_full["rubriek_id"] = 1
    afspraak_dict_full["tegen_rekening_id"] = 1
    afspraak_dict_full["afdeling_id"] = None
    afspraak_dict_full["postadres_id"] = "38d25c77-8cd5-4bbe-9a73-633ec7847794"
    afspraak_dict_full["alarm_id"] = "38d25c77-8cd5-4bbe-9a73-633ec7847795"
    assert response.json["data"] == afspraak_dict_full
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
    ("valid_from", 1234),
    ("valid_through", 1234),
    ("aantal_betalingen", "5"),
    ("betaalinstructie", 1234),
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
