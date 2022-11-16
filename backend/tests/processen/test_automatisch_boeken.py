import pytest
import requests_mock
from pytest_mock import MockerFixture

from hhb_backend.graphql import settings
from hhb_backend.processen.automatisch_boeken import automatisch_boeken
from hhb_backend.service.model.afspraak import Afspraak
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError
from tests.utils.mock_utils import get_by_filter, mock_feature_flag


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


mock_transactions = {
    1: {"id": 1, "is_geboekt": False},
    2: {"id": 2, "is_geboekt": False},
}

mock_afspraken = {
    11: {"id": 11, "rubriek_id": 21, "burger_id": 41, "zoektermen": "test"},
    12: {"id": 12, "rubriek_id": 21, "burger_id": 42, "zoektermen": "test"},
}


def get_transactions(request, _context):
    return get_by_filter(request, mock_transactions)


def get_afspraken(request, _context):
    return get_by_filter(request, mock_afspraken)


@pytest.mark.asyncio
async def test_automatisch_boeken_no_csm_no_transactions(mocker: MockerFixture):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json=post_echo)

        transactions_is_geboekt = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_is_geboekt=false",
            json={"data": []}
        )

        mocker.patch('hhb_backend.processen.automatisch_boeken.transactie_suggesties', return_value={})

        result = await automatisch_boeken()

        assert result is None
        assert transactions_is_geboekt.called_once

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


@pytest.mark.asyncio
async def test_automatisch_boeken_no_csm_no_suggestions(mocker: MockerFixture):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json=post_echo)

        transactions_is_geboekt = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_is_geboekt=false",
            json={"data": [{"id": 1, "is_geboekt": False}]}
        )
        mocker.patch('hhb_backend.processen.automatisch_boeken.transactie_suggesties', return_value={1: []})

        result = await automatisch_boeken()

        assert result is None

        assert transactions_is_geboekt.called_once

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


@pytest.mark.asyncio
async def test_automatisch_boeken_no_csm_success_single(mocker: MockerFixture):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)

        transactions_is_geboekt = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_is_geboekt=false",
            json={"data": [{"id": 1, "is_geboekt": False}]}
        )
        mocker.patch(
            'hhb_backend.processen.automatisch_boeken.transactie_suggesties',
            return_value={1: [Afspraak(id=11, rubriek_id=21, zoektermen="test")]}
        )
        mocker.patch(
            'hhb_backend.feature_flags.Unleash.is_enabled',
            mock_feature_flag("signalen", True)
        )

        rubrieken_by_id = mock.get(
            f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=21",
            json={"data": [{"id": 21, "grootboekrekening_id": "test"}]}
        )

        def journaalposten_post_echo(request, _):
            jp_id = 30
            return {"data": [{**jp, "id": (jp_id := jp_id + 1)} for jp in request.json()]}

        journaalposten_post = mock.post(f"{settings.HHB_SERVICES_URL}/journaalposten/", json=journaalposten_post_echo)
        transactions_post = mock.post(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/1",
            json=post_echo
        )

        result = await automatisch_boeken()

        # check if everything is mocked
        assert not post_any.called
        assert not get_any.called

        assert result == [{'afspraak': {'id': 11, 'rubriek_id': 21, 'zoektermen': 'test'}, 'afspraak_id': 11, 'id': 31, "grootboekrekening_id": "test", 'isAutomatischGeboekt': True, 'transaction_id': 1}]
        
        assert journaalposten_post.call_count == 1
        assert journaalposten_post.last_request.json() == [
            {"afspraak_id": 11, "grootboekrekening_id": "test", "isAutomatischGeboekt": True, "transaction_id": 1}
        ]
        assert transactions_post.call_count == 1
        assert transactions_post.last_request.json() == {"id": 1, "is_geboekt": True}

        assert transactions_is_geboekt.call_count == 1
        assert rubrieken_by_id.call_count == 1


@pytest.mark.asyncio
async def test_automatisch_boeken_no_csm_success_multiple(mocker: MockerFixture):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)

        transactions_is_geboekt = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_is_geboekt=false",
            json={"data": [{"id": 1, "is_geboekt": False}, {"id": 2, "is_geboekt": False}]}
        )
        mocker.patch(
            'hhb_backend.processen.automatisch_boeken.transactie_suggesties',
            return_value={
                1: [Afspraak(id=11, rubriek_id= 21, zoektermen="test")],
                2: [Afspraak(id=12, rubriek_id= 21, zoektermen="test")]
            }
        )
        mocker.patch(
            'hhb_backend.feature_flags.Unleash.is_enabled',
            mock_feature_flag("signalen", True)
        )

        rubrieken_by_id = mock.get(
            f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=21",
            json={"data": [{"id": 21, "grootboekrekening_id": "test"}]}
        )

        journaalposten_post = mock.post(f"{settings.HHB_SERVICES_URL}/journaalposten/", json=post_echo_multi(30))
        log_post = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json=post_echo_single(50))
        transactions_post = mock.post(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/1", json=post_echo)
        transactions_post2 = mock.post(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/2", json=post_echo)

        result = await automatisch_boeken()

        # Check if everything are mocked
        assert not post_any.called
        assert not get_any.called

        assert result == [
            {'afspraak': {'id': 11, 'rubriek_id': 21, 'zoektermen': "test"}, 'afspraak_id': 11, 'id': 31, 'grootboekrekening_id': 'test', 'isAutomatischGeboekt': True, 'transaction_id': 1},
            {'afspraak': {'id': 12, 'rubriek_id': 21, 'zoektermen': "test"}, 'afspraak_id': 12, 'id': 32, 'grootboekrekening_id': 'test', 'isAutomatischGeboekt': True, 'transaction_id': 2}
        ]
        assert journaalposten_post.called_once
        assert journaalposten_post.last_request.json() == [
            {"afspraak_id": 11, "grootboekrekening_id": "test", "isAutomatischGeboekt": True, "transaction_id": 1},
            {"afspraak_id": 12, "grootboekrekening_id": "test", "isAutomatischGeboekt": True, "transaction_id": 2},
        ]
        assert transactions_post.call_count == 1
        assert transactions_post.last_request.json() == {"id": 1, "is_geboekt": True}
        assert transactions_post2.call_count == 1
        assert transactions_post2.last_request.json() == {"id": 2, "is_geboekt": True}

        assert transactions_is_geboekt.called_once
        assert rubrieken_by_id.called_once


@pytest.mark.asyncio
async def test_automatisch_boeken_csm_success_multiple(mocker: MockerFixture):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)

        bank_transactions_by_csm = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_csms=1",
            json={"data": [
                {"id": 1, "customer_statement_message_id": 1, "is_geboekt": False, "transactie_datum": '2020-10-10'},
                {"id": 2, "customer_statement_message_id": 1, "is_geboekt": True, "transactie_datum": '2020-10-10'},
            ]}
        )
        mocker.patch(
            'hhb_backend.processen.automatisch_boeken.transactie_suggesties',
            return_value={1: [Afspraak(id=11, rubriek_id= 21, zoektermen="test", valid_through='2020-12-31')]}
        )
        mocker.patch(
            'hhb_backend.feature_flags.Unleash.is_enabled',
            mock_feature_flag("signalen", True)
        )

        rubrieken_by_id = mock.get(
            f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=21",
            json={"data": [{"id": 21, "grootboekrekening_id": "test"}]}
        )

        journaalposten_post = mock.post(f"{settings.HHB_SERVICES_URL}/journaalposten/", json=post_echo_multi(30))
        transactions_post = mock.post(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/1", json=post_echo)

        result = await automatisch_boeken(1)

        # check if everything is mocked
        assert not post_any.called
        assert not get_any.called

        assert result == [{'afspraak': {'id': 11, 'rubriek_id': 21, 'zoektermen': 'test', 'valid_through':'2020-12-31'}, 'id': 31, 'grootboekrekening_id': 'test', 'isAutomatischGeboekt': True, 'transaction_id': 1, 'afspraak_id': 11}]
        
        assert journaalposten_post.call_count == 1
        assert journaalposten_post.last_request.json() == [
            {"afspraak_id": 11, "grootboekrekening_id": "test", "isAutomatischGeboekt": True, "transaction_id": 1},
        ]
        assert transactions_post.call_count == 1
        assert transactions_post.last_request.json() == {"id": 1, "customer_statement_message_id": 1, "is_geboekt": True, "transactie_datum": '2020-10-10'}

        assert bank_transactions_by_csm.call_count == 1
        assert rubrieken_by_id.call_count == 1


@pytest.mark.asyncio
async def test_automatisch_boeken_no_csm_failure_journaalpost_exists(mocker: MockerFixture):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)

        transactions_is_geboekt = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_is_geboekt=false",
            json={"data": [{"id": 1, "is_geboekt": False}]}
        )
        mocker.patch(
            'hhb_backend.processen.automatisch_boeken.transactie_suggesties',
            return_value={1: [Afspraak(id=11, rubriek_id= 21, zoektermen="test")]}
        )
        mocker.patch(
            'hhb_backend.feature_flags.Unleash.is_enabled',
            mock_feature_flag("signalen", True)
        )

        rubrieken_by_id = mock.get(
            f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=21",
            json={"data": [{"id": 21, "grootboekrekening_id": "test"}]}
        )

        journaalposten_post = mock.post(
            f"{settings.HHB_SERVICES_URL}/journaalposten/", 
            text="journaalpost",
            status_code=409
        )
       
        transactions_post = mock.post(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/1",
            json=post_echo
        )

        with pytest.raises(UpstreamError) as excinfo:
            await automatisch_boeken()
            
        assert "Could not POST to journaalposten." in str(excinfo.value)

        # Check if everything is mocked
        assert not post_any.called
        assert not get_any.called

        assert journaalposten_post.call_count == 1
        assert journaalposten_post.last_request.json() == [
            {"afspraak_id": 11, "grootboekrekening_id": "test", "isAutomatischGeboekt": True, "transaction_id": 1}
        ]
        assert transactions_post.call_count == 0

        assert transactions_is_geboekt.call_count == 1
        assert rubrieken_by_id.call_count == 1


@pytest.mark.asyncio
async def test_automatisch_boeken_no_csm_multiple_suggesties(mocker: MockerFixture):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)

        transactions_is_geboekt = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_is_geboekt=false",
            json={"data": [
                {"id": 1, "is_geboekt": False},
                {"id": 2, "is_geboekt": False},
                {"id": 3, "is_geboekt": False},
            ]}
        )
        mocker.patch(
            'hhb_backend.processen.automatisch_boeken.transactie_suggesties',
            return_value={
                1: [Afspraak(id=11, rubriek_id= 21, zoektermen="test")],
                2: [Afspraak(id=12, rubriek_id= 21, zoektermen="test")],
                # This transaction will not be booked
                3: [
                    Afspraak(id=13, rubriek_id= 21, zoektermen="test"),
                    Afspraak(id=23, rubriek_id= 21, zoektermen="test"),
                ],
            })
        mocker.patch(
            'hhb_backend.feature_flags.Unleash.is_enabled',
            mock_feature_flag("signalen", True)
        )

        rubrieken_by_id = mock.get(
            f"{settings.HHB_SERVICES_URL}/rubrieken/?filter_ids=21",
            json={"data": [{"id": 21, "grootboekrekening_id": "test"}]}
        )

        journaalposten_post = mock.post(f"{settings.HHB_SERVICES_URL}/journaalposten/", json=post_echo_multi(30))
        transactions_post = mock.post(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/1", json=post_echo)
        transactions_post2 = mock.post(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/2", json=post_echo)

        result = await automatisch_boeken()
        
        # check if everything is mocked
        assert post_any.call_count == 0
        assert get_any.call_count == 0

        assert result == [
            {'afspraak': {'id': 11, 'rubriek_id': 21, 'zoektermen': 'test'}, 'id': 31, 'isAutomatischGeboekt': True, 'transaction_id': 1, 'afspraak_id': 11, 'grootboekrekening_id': 'test'},
            {'afspraak': {'id': 12, 'rubriek_id': 21, 'zoektermen': 'test'}, 'id': 32, 'isAutomatischGeboekt': True, 'transaction_id': 2, 'afspraak_id': 12, 'grootboekrekening_id': 'test'},
        ]
        assert journaalposten_post.called_once
        assert journaalposten_post.last_request.json() == [
            {"afspraak_id": 11, "grootboekrekening_id": "test", "isAutomatischGeboekt": True, "transaction_id": 1},
            {"afspraak_id": 12, "grootboekrekening_id": "test", "isAutomatischGeboekt": True, "transaction_id": 2},
        ]
        assert transactions_post.call_count == 1
        assert transactions_post.last_request.json() == {"id": 1, "is_geboekt": True}
        assert transactions_post2.call_count == 1
        assert transactions_post2.last_request.json() == {"id": 2, "is_geboekt": True} 

        assert transactions_is_geboekt.call_count == 1
        assert rubrieken_by_id.call_count == 1