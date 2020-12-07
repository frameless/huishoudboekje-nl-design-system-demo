import logging
from urllib.parse import urlencode

import pytest


def dict_only_keys_with_values(input_dict: dict):
    """ Only pass through dict items when it's value is not None """
    return {k: v for k, v in input_dict.items() if v is not None}


def dict_keys_subset_builder(match_keys: list):
    """only include items with a matching key"""
    return lambda actual_dict: dict((k, actual_dict[k] if k in actual_dict else None) for k in match_keys)


@pytest.mark.parametrize("begin_datum, eind_datum, afspraken, expected", [
    ("2021-01-01", "2021-02-01", [
        dict(beschrijving="precies pas", start_datum="2021-01-01", eind_datum="2021-02-01"),
        dict(beschrijving="eromheen", start_datum="2020-01-01", eind_datum="2021-12-31"),
    ], [
         dict(beschrijving="precies pas", start_datum="2021-01-01", eind_datum="2021-02-01"),
         dict(beschrijving="eromheen", start_datum="2020-01-01", eind_datum='2021-12-31'),
     ]),

    ("2021-01-01", "2021-02-01", [
        dict(beschrijving="te vroeg", start_datum="2020-01-01", eind_datum="2020-12-31"),
        dict(beschrijving="te vroeg", start_datum="2020-01-01", eind_datum="2021-01-01"),
    ], []),

    ("2021-01-01", "2021-02-01", [
        dict(beschrijving="te laat", start_datum="2021-02-02", eind_datum="2021-12-31"),
        dict(beschrijving="te laat, open", start_datum="2021-02-02", eind_datum=None),
    ], []),

    ("2021-01-01", "2021-02-01", [
        dict(beschrijving="start voor begin, open", start_datum="2020-12-31", eind_datum=None),
        dict(beschrijving="start na begin, open", start_datum="2021-01-02", eind_datum=None),
    ], [
         dict(beschrijving="start voor begin, open", start_datum="2020-12-31", eind_datum=None),
         dict(beschrijving="start na begin, open", start_datum="2021-01-02", eind_datum=None),
     ]),
])
def test_afspraken_get_datum_filter(app, afspraak_factory, caplog, begin_datum, eind_datum, afspraken, expected):
    caplog.set_level(logging.DEBUG)
    for afspraak in afspraken:
        afspraak_factory.createAfspraak(**afspraak)
    client = app.test_client()
    response = client.get(f'/afspraken/?{urlencode({"begin_datum": begin_datum, "eind_datum": eind_datum})}')

    assert response.status_code == 200

    actual_afspraken = response.json["data"]

    assert len(actual_afspraken) == len(expected)

    dict_keys_subset = dict_keys_subset_builder(['beschrijving', 'start_datum', 'eind_datum'])
    # the order of results is expected to be the same as the verication set
    for actual_response, expected_afspraak in zip(actual_afspraken, expected):
        # assert only the properties we are interested in for the test case
        assert dict_keys_subset(actual_response) == dict_keys_subset(expected_afspraak)


@pytest.mark.parametrize("begin_datum, eind_datum, statuscode, message", [
    (None, "2021-01-01", 400, "begin_datum is missing"),
    ("2021-01-01", None, 400, "eind_datum is missing"),
    ("2021-01-01", "2020-12-31", 400, "eind_datum must be after begin_datum"),

])
def test_afspraken_get_datum_filter_errors(app, begin_datum, eind_datum, statuscode, message):
    client = app.test_client()
    response = client.get(
        f'/afspraken/?{urlencode(dict_only_keys_with_values({"begin_datum": begin_datum, "eind_datum": eind_datum}))}')
    assert response.status_code == statuscode
    assert response.json["errors"][0] == message
