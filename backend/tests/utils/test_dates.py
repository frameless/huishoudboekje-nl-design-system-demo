from datetime import date

import pytest

from hhb_backend.graphql.utils.dates import afspraken_intersect


@pytest.mark.parametrize(
    ["valid_from1", "valid_through1", "valid_from2", "valid_through2", "expected"],
    [
        # After
        (date(2020, 1, 1), date(2020, 1, 2), date(2020, 1, 3), date(2020, 1, 4), False),
        # StartTouching
        (date(2020, 1, 1), date(2020, 1, 2), date(2020, 1, 2), date(2020, 1, 3), True),
        # StartInside
        (date(2020, 1, 1), date(2020, 1, 3), date(2020, 1, 2), date(2020, 1, 4), True),
        # InsideStartTouching
        (date(2020, 1, 1), date(2020, 1, 3), date(2020, 1, 1), date(2020, 1, 2), True),
        # EnclosingStartTouching
        (date(2020, 1, 1), date(2020, 1, 2), date(2020, 1, 1), date(2020, 1, 3), True),
        # Enclosing
        (date(2020, 1, 2), date(2020, 1, 3), date(2020, 1, 1), date(2020, 1, 4), True),
        # EnclosingEndTouching
        (date(2020, 1, 2), date(2020, 1, 3), date(2020, 1, 1), date(2020, 1, 3), True),
        # ExactMatch
        (date(2020, 1, 1), date(2020, 1, 2), date(2020, 1, 1), date(2020, 1, 2), True),
        # Inside
        (date(2020, 1, 1), date(2020, 1, 4), date(2020, 1, 2), date(2020, 1, 3), True),
        # InsideEndTouching
        (date(2020, 1, 1), date(2020, 1, 3), date(2020, 1, 2), date(2020, 1, 3), True),
        # EndInside
        (date(2020, 1, 2), date(2020, 1, 4), date(2020, 1, 1), date(2020, 1, 3), True),
        # EndTouching
        (date(2020, 1, 2), date(2020, 1, 3), date(2020, 1, 1), date(2020, 1, 2), True),
        # Before
        (date(2020, 1, 3), date(2020, 1, 4), date(2020, 1, 1), date(2020, 1, 2), False),
    ],
)
def test_afspraken_intersect(valid_from1, valid_through1, valid_from2, valid_through2, expected):
    """
    For a visualization of the terms, see: https://www.codeproject.com/KB/datetime/TimePeriod/PeriodRelations.png
    """
    result = afspraken_intersect(
        valid_from1=valid_from1,
        valid_from2=valid_from2,
        valid_through1=valid_through1,
        valid_through2=valid_through2,
    )
    assert result == expected
