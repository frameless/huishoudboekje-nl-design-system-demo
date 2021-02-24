import pytest
import requests_mock

from hhb_backend.graphql import settings
from hhb_backend.processen.automatisch_boeken import transactie_suggesties


def post_echo(request, _context):
    return {"data": (request.json())}


@pytest.mark.asyncio
async def test_transactie_suggesties(test_request_context):
    #with requests_mock.Mocker() as mock:
        #get_any = mock.get(requests_mock.ANY, json={"data": []})
        #post_any = mock.post(requests_mock.ANY, json=post_echo)

        # transactions_is_geboekt = mock.get(
        #     f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/filter_ids=1,2,3", json={'data': [
        #         {'id': 1, 'information_to_account_owner': None, 'bedrag': 10000, 'tegen_rekening': None},
        #         {'id': 1, 'information_to_account_owner': None, 'bedrag': 10000, 'tegen_rekening': None},
        #         {'id': 1, 'information_to_account_owner': None, 'bedrag': 10000, 'tegen_rekening': None}]})

        result = await transactie_suggesties([7,8])

        assert result is None
        # assert transactions_is_geboekt.called_once
        #
        # # No leftover calls
        # assert not post_any.called
        # assert not get_any.called
