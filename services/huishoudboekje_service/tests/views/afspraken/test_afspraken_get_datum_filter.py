import logging
from urllib.parse import urlencode

import pytest


def dict_only_keys_with_values(input_dict: dict):
    """ Only pass through dict items when it's value is not None """
    return {k: v for k, v in input_dict.items() if v is not None}


def dict_keys_subset_builder(match_keys: list):
    """only include items with a matching key"""
    return lambda actual_dict: dict((k, actual_dict[k] if k in actual_dict else None) for k in match_keys)


@pytest.mark.parametrize("valid_from, valid_through, afspraken, expected", [
    ("2021-01-01", "2021-02-01", [
        dict(omschrijving="precies pas", valid_from="2021-01-01T00:00:00", valid_through="2021-02-01T00:00:00"),
        dict(omschrijving="eromheen", valid_from="2020-01-01T00:00:00", valid_through="2021-12-31T00:00:00"),
    ], [
         dict(omschrijving="precies pas", valid_from="2021-01-01T00:00:00", valid_through="2021-02-01T00:00:00"),
         dict(omschrijving="eromheen", valid_from="2020-01-01T00:00:00", valid_through='2021-12-31T00:00:00'),
     ]),

     
    ("2021-01-01", "2021-01-01", [
        dict(omschrijving="precies een dag", valid_from="2021-01-01T00:00:00", valid_through="2021-01-01T00:00:00"),
    ], [
         dict(omschrijving="precies een dag", valid_from="2021-01-01T00:00:00", valid_through="2021-01-01T00:00:00"),
     ]),

    ("2021-01-02", "2021-02-01", [
        dict(omschrijving="te vroeg", valid_from="2020-01-01T00:00:00", valid_through="2020-12-31T00:00:00"),
        dict(omschrijving="te vroeg", valid_from="2020-01-01T00:00:00", valid_through="2021-01-01T00:00:00"),
    ], []),

    ("2021-01-01", "2021-02-01", [
        dict(omschrijving="te laat", valid_from="2021-02-02T00:00:00", valid_through="2021-12-31T00:00:00"),
        dict(omschrijving="te laat, open", valid_from="2021-02-02T00:00:00", valid_through=None),
    ], []),

    ("2021-01-01", "2021-02-01", [
        dict(omschrijving="start voor begin, open", valid_from="2020-12-31T00:00:00", valid_through=None),
        dict(omschrijving="start na begin, open", valid_from="2021-01-02T00:00:00", valid_through=None),
    ], [
         dict(omschrijving="start voor begin, open", valid_from="2020-12-31T00:00:00", valid_through=None),
         dict(omschrijving="start na begin, open", valid_from="2021-01-02T00:00:00", valid_through=None),
     ]),
])
def test_afspraken_get_datum_filter(app, afspraak_factory, caplog, valid_from, valid_through, afspraken, expected):
    caplog.set_level(logging.DEBUG)
    for afspraak in afspraken:
        afspraak_factory.createAfspraak(**afspraak)
    client = app.test_client()
    response = client.get(f'/afspraken/?{urlencode({"valid_from": valid_from, "valid_through": valid_through})}')

    assert response.status_code == 200

    actual_afspraken = response.json["data"]

    assert len(actual_afspraken) == len(expected)

    dict_keys_subset = dict_keys_subset_builder(['omschrijving', 'valid_from', 'valid_through'])
    # the order of results is expected to be the same as the verication set
    for actual_response, expected_afspraak in zip(actual_afspraken, expected):
        # assert only the properties we are interested in for the test case
        assert dict_keys_subset(actual_response) == dict_keys_subset(expected_afspraak)


@pytest.mark.parametrize("valid_from, valid_through, statuscode, message", [
    (None, "2021-01-01", 400, "valid_from is missing"),
    ("2021-01-01", None, 400, "valid_through is missing"),
    ("2021-01-01", "2020-12-31", 400, "valid_through must be after valid_from"),

])
def test_afspraken_get_datum_filter_errors(app, valid_from, valid_through, statuscode, message):
    client = app.test_client()
    response = client.get(
        f'/afspraken/?{urlencode(dict_only_keys_with_values({"valid_from": valid_from, "valid_through": valid_through}))}')
    assert response.status_code == statuscode
    assert response.json["errors"][0] == message
