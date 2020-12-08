import logging
from urllib.parse import urlencode

import pytest


def dict_only_keys_with_values(input_dict: dict):
    """ Only pass through dict items when it's value is not None """
    return {k: v for k, v in input_dict.items() if v is not None}


def dict_keys_subset_builder(match_keys: list):
    """only include items with a matching key"""
    return lambda actual_dict: dict((k, actual_dict[k] if k in actual_dict else None) for k in match_keys)


@pytest.mark.parametrize("begin_timestamp, eind_timestamp, exports, expected", [
    ("2021-01-01", "2021-02-01", [
        dict(naam="export.pain", timestamp="2021-01-01T00:00:00"),
    ], [
         dict(naam="export.pain", timestamp="2021-01-01T00:00:00"),
     ]),

    ("2021-01-01", "2021-02-01", [
        dict(naam="ervoor.pain", timestamp="2020-01-01T00:00:00"),
    ], []),

    ("2021-01-01", "2021-02-01", [
        dict(naam="erna.pain", timestamp="2022-01-01T00:00:00"),
    ], []),
])
def test_exports_get_timestamp_filter(app, export_factory, caplog, begin_timestamp, eind_timestamp, exports, expected):
    for export in exports:
        export_factory.createExport(**export)
    client = app.test_client()
    response = client.get(f'/export/?{urlencode({"begin_timestamp": begin_timestamp, "eind_timestamp": eind_timestamp})}')

    assert response.status_code == 200

    actual_exports = response.json["data"]

    assert len(actual_exports) == len(expected)

    dict_keys_subset = dict_keys_subset_builder(['naam', 'start_timestamp', 'eind_timestamp'])
    # the order of results is expected to be the same as the verication set
    for actual_response, expected_export in zip(actual_exports, expected):
        # assert only the properties we are interested in for the test case
        assert dict_keys_subset(actual_response) == dict_keys_subset(expected_export)


@pytest.mark.parametrize("begin_timestamp, eind_timestamp, statuscode, message", [
    (None, "2021-01-01", 400, "begin_timestamp is missing"),
    ("2021-01-01", None, 400, "eind_timestamp is missing"),
    ("2021-01-01", "2020-12-31", 400, "eind_timestamp must be after begin_timestamp"),

])
def test_exports_get_timestamp_filter_errors(app, begin_timestamp, eind_timestamp, statuscode, message):
    client = app.test_client()
    response = client.get(
        f'/export/?{urlencode(dict_only_keys_with_values({"begin_timestamp": begin_timestamp, "eind_timestamp": eind_timestamp}))}')
    assert response.status_code == statuscode
    assert response.json["errors"][0] == message
