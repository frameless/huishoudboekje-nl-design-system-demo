import re

import pytest
import requests_mock
from pytest_mock import MockerFixture

from hhb_backend.graphql import settings
from hhb_backend.processen.automatisch_boeken import automatisch_boeken


def post_echo(request, _context):
    return {"data": (request.json())}


def post_echo_multi(start_id):
    def id_seq():
        num = start_id
        while True:
            num += 1
            yield num

    def echo(request, _):
        id = id_seq()
        return {"data": [{**jp, "id": next(id)} for jp in request.json()]}

    return echo


def post_echo_single(start_id):
    def echo(request, _):
        return {"data": {**request.json(), "id": start_id + 1}}

    return echo


@pytest.mark.asyncio
async def test_automatisch_boeken_no_csm_no_transactions(test_request_context, mocker: MockerFixture):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json=post_echo)

        transactions_is_geboekt = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_is_geboekt=false",
            json={"data": []})

        mocker.patch('hhb_backend.processen.automatisch_boeken.transactie_suggesties', return_value={})

        result = await automatisch_boeken()

        assert result is None
        assert transactions_is_geboekt.called_once

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


@pytest.mark.asyncio
async def test_automatisch_boeken_no_csm_no_suggestions(test_request_context, mocker: MockerFixture):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json=post_echo)

        transactions_is_geboekt = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_is_geboekt=false",
            json={"data": [{"id": 1, "is_geboekt": False}]})
        mocker.patch('hhb_backend.processen.automatisch_boeken.transactie_suggesties', return_value={1: []})

        result = await automatisch_boeken()

        assert result is None

        assert transactions_is_geboekt.called_once

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


@pytest.mark.asyncio
async def test_automatisch_boeken_no_csm_success_single(test_request_context, mocker: MockerFixture):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)

        transactions_is_geboekt = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_is_geboekt=false",
            json={"data": [{"id": 1, "is_geboekt": False}]})
        mocker.patch('hhb_backend.processen.automatisch_boeken.transactie_suggesties',
                     return_value={1: [{"id": 11, "zoektermen": "test"}]})

        transactions_by_id = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids=1",
            json={"data": [{"id": 1, "is_geboekt": False}]})
        journaalposten_by_transaction = mock.get(f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_transactions=1",
                                                 json={"data": []})
        afspraken_by_id = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=11",
            json={"data": [{"id": 11, "rubriek_id": 21, "burger_id": 41, "zoektermen": "test"}]})
        rubrieken_by_id = mock.get(
            f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=21",
            json={"data": [{"id": 21, "grootboekrekening_id": "test"}]})

        def journaalposten_post_echo(request, _):
            jp_id = 30
            return {"data": [{**jp, "id": (jp_id := jp_id + 1)} for jp in request.json()]}

        journaalposten_post = mock.post(f"{settings.HHB_SERVICES_URL}/journaalposten/", json=journaalposten_post_echo)
        log_post = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
        transactions_post = mock.post(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/1",
            json=post_echo)

        result = await automatisch_boeken()

        assert result == [{'afspraak': {'id': 11}, 'id': 31, 'isAutomatischGeboekt': True, 'transaction': {'id': 1}}]
        assert journaalposten_post.called_once
        assert journaalposten_post.last_request.json() == [
            {"afspraak_id": 11, "grootboekrekening_id": "test", "is_automatisch_geboekt": True, "transaction_id": 1}]
        assert transactions_post.called_once
        assert transactions_post.last_request.json() == [{"id": 1, "is_geboekt": True}]

        assert transactions_is_geboekt.called_once
        assert transactions_by_id.called_once
        assert journaalposten_by_transaction.called_once
        assert afspraken_by_id.called_once
        assert rubrieken_by_id.called_once

        assert log_post.called_once
        # No leftover calls
        assert not post_any.called
        assert not get_any.called


@pytest.mark.asyncio
async def test_automatisch_boeken_no_csm_success_multiple(test_request_context, mocker: MockerFixture):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)

        transactions_is_geboekt = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_is_geboekt=false",
            json={"data": [{"id": 1, "is_geboekt": False},
                           {"id": 2, "is_geboekt": False},
                           ]})
        mocker.patch('hhb_backend.processen.automatisch_boeken.transactie_suggesties',
                     return_value={1: [{"id": 11, "zoektermen": "test"}],
                                   2: [{"id": 12, "zoektermen": "test"}],
                                   })

        transactions_by_id = mock.get(
            re.compile(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/\?filter_ids=1,2"),
            json={"data": [{"id": 1, "is_geboekt": False},
                           {"id": 2, "is_geboekt": False},
                           ]})
        journaalposten_by_transaction = mock.get(f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_transactions=1,2",
                                                 json={"data": []})
        afspraken_by_id = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=11,12",
            json={"data": [{"id": 11, "rubriek_id": 21, "burger_id": 41, "zoektermen": "test"},
                           {"id": 12, "rubriek_id": 21, "burger_id": 42, "zoektermen": "test"},
                           ]})
        rubrieken_by_id = mock.get(
            f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=21",
            json={"data": [{"id": 21, "grootboekrekening_id": "test"}]})

        journaalposten_post = mock.post(f"{settings.HHB_SERVICES_URL}/journaalposten/", json=post_echo_multi(30))
        log_post = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json=post_echo_single(50))
        transactions_post = mock.post(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/1,2", json=post_echo)

        result = await automatisch_boeken()

        assert result == [{'afspraak': {'id': 11}, 'id': 31, 'isAutomatischGeboekt': True, 'transaction': {'id': 1}},
                          {'afspraak': {'id': 12}, 'id': 32, 'isAutomatischGeboekt': True, 'transaction': {'id': 2}},
                          ]
        assert journaalposten_post.called_once
        assert journaalposten_post.last_request.json() == [
            {"afspraak_id": 11, "grootboekrekening_id": "test", "is_automatisch_geboekt": True, "transaction_id": 1},
            {"afspraak_id": 12, "grootboekrekening_id": "test", "is_automatisch_geboekt": True, "transaction_id": 2},
        ]
        assert transactions_post.call_count == 1
        assert transactions_post.last_request.json() == [{"id": 1, "is_geboekt": True}, {"id": 2, "is_geboekt": True}]

        assert transactions_is_geboekt.called_once
        assert transactions_by_id.called_once
        assert journaalposten_by_transaction.called_once
        assert afspraken_by_id.called_once
        assert rubrieken_by_id.called_once

        assert log_post.called_once
        # No leftover calls
        assert not post_any.called
        assert not get_any.called


@pytest.mark.asyncio
async def test_automatisch_boeken_csm_success_multiple(test_request_context, mocker: MockerFixture):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)

        bank_transactions_by_csm = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_csms=1",
            json={"data": [{"id": 1, "customer_statement_message_id": 1, "is_geboekt": False, "transactie_datum": '2020-10-10'},
                           {"id": 2, "customer_statement_message_id": 1, "is_geboekt": True, "transactie_datum": '2020-10-10'},
                           ]})
        mocker.patch('hhb_backend.processen.automatisch_boeken.transactie_suggesties',
                     return_value={1: [{"id": 11, "zoektermen": "test", "valid_through": '2020-12-31'}],
                                   })

        transactions_by_id = mock.get(
            re.compile(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/\?filter_ids=1"),
            json={"data": [{"id": 1, "is_geboekt": False},
                           ]})
        journaalposten_by_transaction = mock.get(f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_transactions=1",
                                                 json={"data": []})
        afspraken_by_id = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=11",
            json={"data": [{"id": 11, "rubriek_id": 21, "burger_id": 41, "zoektermen": "test", "valid_through": '2020-12-31'},
                           ]})
        rubrieken_by_id = mock.get(
            f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=21",
            json={"data": [{"id": 21, "grootboekrekening_id": "test"}]})

        journaalposten_post = mock.post(f"{settings.HHB_SERVICES_URL}/journaalposten/", json=post_echo_multi(30))
        log_post = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json=post_echo_single(50))
        transactions_post = mock.post(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/1", json=post_echo)

        result = await automatisch_boeken(1)

        assert result == [{'afspraak': {'id': 11}, 'id': 31, 'isAutomatischGeboekt': True, 'transaction': {'id': 1}},
                          ]
        assert journaalposten_post.called_once
        assert journaalposten_post.last_request.json() == [
            {"afspraak_id": 11, "grootboekrekening_id": "test", "is_automatisch_geboekt": True, "transaction_id": 1},
        ]
        assert transactions_post.call_count == 1
        assert transactions_post.last_request.json() == [{"id": 1, "is_geboekt": True}]

        assert bank_transactions_by_csm.called_once
        assert transactions_by_id.called_once
        assert journaalposten_by_transaction.called_once
        assert afspraken_by_id.called_once
        assert rubrieken_by_id.called_once

        assert log_post.called_once
        # No leftover calls
        assert not post_any.called
        assert not get_any.called




@pytest.mark.asyncio
async def test_automatisch_boeken_no_csm_failure_journaalpost_exists(test_request_context, mocker: MockerFixture):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)

        transactions_is_geboekt = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_is_geboekt=false",
            json={"data": [{"id": 1, "is_geboekt": False}]})
        mocker.patch('hhb_backend.processen.automatisch_boeken.transactie_suggesties',
                     return_value={1: [{"id": 11, "zoektermen": "test"}]})

        transactions_by_id = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids=1",
            json={"data": [{"id": 1, "is_geboekt": False}]})
        journaalposten_by_transaction = mock.get(f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_transactions=1",
                                                 json={"data": []})
        afspraken_by_id = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=11",
            json={"data": [{"id": 11, "rubriek_id": 21, "burger_id": 41, "zoektermen": "test"}]})
        rubrieken_by_id = mock.get(
            f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=21",
            json={"data": [{"id": 21, "grootboekrekening_id": "test"}]})

        def journaalposten_post_echo(request, _):
            jp_id = 30
            return {"data": [{**jp, "id": (jp_id := jp_id + 1)} for jp in request.json()]}

        journaalposten_post = mock.post(f"{settings.HHB_SERVICES_URL}/journaalposten/", status_code=409,
                                        text="journaalpost")
        log_post = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
        transactions_post = mock.post(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/1",
            json=post_echo)

        result = await automatisch_boeken()

        assert result == None
        assert journaalposten_post.called_once
        assert journaalposten_post.last_request.json() == [
            {"afspraak_id": 11, "grootboekrekening_id": "test", "is_automatisch_geboekt": True, "transaction_id": 1}]
        assert not transactions_post.called

        assert transactions_is_geboekt.called_once
        assert transactions_by_id.called_once
        assert journaalposten_by_transaction.called_once
        assert afspraken_by_id.called_once
        assert rubrieken_by_id.called_once

        assert not log_post.called

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


@pytest.mark.asyncio
async def test_automatisch_boeken_no_csm_multiple_suggesties(test_request_context, mocker: MockerFixture):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)

        transactions_is_geboekt = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_is_geboekt=false",
            json={"data": [{"id": 1, "is_geboekt": False},
                           {"id": 2, "is_geboekt": False},
                           {"id": 3, "is_geboekt": False},
                           ]})
        mocker.patch('hhb_backend.processen.automatisch_boeken.transactie_suggesties',
                     return_value={1: [{"id": 11, "zoektermen": "test"}],
                                   2: [
                                       {"id": 12, "zoektermen": "test"},
                                   ],
                                   # This transaction will not be booked
                                   3: [
                                       {"id": 13, "zoektermen": "test"},
                                       {"id": 23, "zoektermen": "test"},
                                   ],
                                   })

        transactions_by_id = mock.get(
            re.compile(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/\?filter_ids=1,2"),
            json={"data": [{"id": 1, "is_geboekt": False},
                           {"id": 2, "is_geboekt": False},
                           ]})
        journaalposten_by_transaction = mock.get(f"{settings.HHB_SERVICES_URL}/journaalposten/?filter_transactions=1,2",
                                                 json={"data": []})
        afspraken_by_id = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=11,12",
            json={"data": [{"id": 11, "rubriek_id": 21, "burger_id": 41, "zoektermen": "test"},
                           {"id": 12, "rubriek_id": 21, "burger_id": 42, "zoektermen": "test"}
                           ]})
        rubrieken_by_id = mock.get(
            f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=21",
            json={"data": [{"id": 21, "grootboekrekening_id": "test"}]})

        journaalposten_post = mock.post(f"{settings.HHB_SERVICES_URL}/journaalposten/", json=post_echo_multi(30))
        log_post = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json=post_echo_single(50))
        transactions_post = mock.post(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/1,2", json=post_echo)

        result = await automatisch_boeken()

        assert result == [{'afspraak': {'id': 11}, 'id': 31, 'isAutomatischGeboekt': True, 'transaction': {'id': 1}},
                          {'afspraak': {'id': 12}, 'id': 32, 'isAutomatischGeboekt': True, 'transaction': {'id': 2}},
                          ]
        assert journaalposten_post.called_once
        assert journaalposten_post.last_request.json() == [
            {"afspraak_id": 11, "grootboekrekening_id": "test", "is_automatisch_geboekt": True, "transaction_id": 1},
            {"afspraak_id": 12, "grootboekrekening_id": "test", "is_automatisch_geboekt": True, "transaction_id": 2},
        ]
        assert transactions_post.call_count == 1
        assert transactions_post.last_request.json() == [{"id": 1, "is_geboekt": True}, {"id": 2, "is_geboekt": True}]

        assert transactions_is_geboekt.called_once
        assert transactions_by_id.called_once
        assert journaalposten_by_transaction.called_once
        assert afspraken_by_id.called_once
        assert rubrieken_by_id.called_once

        assert log_post.called_once
        # No leftover calls
        assert not post_any.called
        assert not get_any.called
