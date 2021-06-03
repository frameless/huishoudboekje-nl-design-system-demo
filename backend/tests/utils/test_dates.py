import pytest

from hhb_backend.graphql.utils.dates import afspraken_intersect


@pytest.mark.parametrize(["afspraak1", "afspraak2", "expected"], [
    # After
    ({"valid_from": "2020-01-01", "valid_through": "2020-01-02"}, {"valid_from": "2020-01-03", "valid_through": "2020-01-04"}, False),
    # StartTouching
    ({"valid_from": "2020-01-01", "valid_through": "2020-01-02"}, {"valid_from": "2020-01-02", "valid_through": "2020-01-03"}, True),
    # StartInside
    ({"valid_from": "2020-01-01", "valid_through": "2020-01-03"}, {"valid_from": "2020-01-02", "valid_through": "2020-01-04"}, True),
    # InsideStartTouching
    ({"valid_from": "2020-01-01", "valid_through": "2020-01-03"}, {"valid_from": "2020-01-01", "valid_through": "2020-01-02"}, True),
    # EnclosingStartTouching
    ({"valid_from": "2020-01-01", "valid_through": "2020-01-02"}, {"valid_from": "2020-01-01", "valid_through": "2020-01-03"}, True),
    # Enclosing
    ({"valid_from": "2020-01-02", "valid_through": "2020-01-03"}, {"valid_from": "2020-01-01", "valid_through": "2020-01-04"}, True),
    # EnclosingEndTouching
    ({"valid_from": "2020-01-02", "valid_through": "2020-01-03"}, {"valid_from": "2020-01-01", "valid_through": "2020-01-03"}, True),
    # ExactMatch
    ({"valid_from": "2020-01-01", "valid_through": "2020-01-02"}, {"valid_from": "2020-01-01", "valid_through": "2020-01-02"}, True),
    # Inside
    ({"valid_from": "2020-01-01", "valid_through": "2020-01-04"}, {"valid_from": "2020-01-02", "valid_through": "2020-01-03"}, True),
    # InsideEndTouching
    ({"valid_from": "2020-01-01", "valid_through": "2020-01-03"}, {"valid_from": "2020-01-02", "valid_through": "2020-01-03"}, True),
    # EndInside
    ({"valid_from": "2020-01-02", "valid_through": "2020-01-04"}, {"valid_from": "2020-01-01", "valid_through": "2020-01-03"}, True),
    # EndTouching
    ({"valid_from": "2020-01-02", "valid_through": "2020-01-03"}, {"valid_from": "2020-01-01", "valid_through": "2020-01-02"}, True),
    # Before
    ({"valid_from": "2020-01-03", "valid_through": "2020-01-04"}, {"valid_from": "2020-01-01", "valid_through": "2020-01-02"}, False),
])
def test_afspraken_intersect(afspraak1, afspraak2, expected):
    """
    For a visualization of the terms, see: https://www.codeproject.com/KB/datetime/TimePeriod/PeriodRelations.png
    """
    result = afspraken_intersect(afspraak1=afspraak1, afspraak2=afspraak2)
    assert result == expected
