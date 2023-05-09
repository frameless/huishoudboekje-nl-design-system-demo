from datetime import datetime
import pytest
import requests_mock
from pytest_mock import MockerFixture

from hhb_backend.graphql import settings
from hhb_backend.processen.saldo_berekenen import update_or_create_saldo
from hhb_backend.service.model.afspraak import Afspraak
from hhb_backend.graphql.utils.upstream_error_handler import UpstreamError
from tests.utils.mock_utils import get_by_filter, mock_feature_flag

test_journaalpost = {'afspraak_id': 1, 'grootboekrekening_id': 'WBedHuiGweWat', 'id': 1, 'is_automatisch_geboekt': True, 'transaction_id': 1, 'afspraak': {'aantal_betalingen': None, 'afdeling_id': 17, 'alarm_id': None, 'bedrag': 5000, 'betaalinstructie': None, 'burger_id': 1, 'credit': False, 'id': 1, 'journaalposten': [
    1], 'omschrijving': 'Water', 'overschrijvingen': [], 'postadres_id': 'df95cfa4-6a1f-46af-a394-c635f14e4fc7', 'rubriek_id': 7, 'tegen_rekening_id': 15, 'valid_from': '2019-01-01T00:00:00', 'valid_through': None, 'zoektermen': ['Water', 'ZOEKTERMPERSONA2']}}

test_transaction = {'bedrag': -5000, 'customer_statement_message_id': 1, 'id': 1, 'information_to_account_owner': 'NL94INGB0000869000               Water ZOEKTERMPERSONA2 juli 2023',
                    'is_credit': False, 'is_geboekt': False, 'statement_line': '230701D-45.77NMSC028', 'tegen_rekening': 'NL94INGB0000869000', 'transactie_datum': '2023-07-01T00:00:00'}


def test_adding_saldo__when_not_exist__should_create_new_saldo(test_request_context):
    with requests_mock.Mocker() as mock:
        # Arrange
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json={"data": []})
        put_any = mock.put(requests_mock.ANY, json={"data": []})

        get_transaction = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids=1",
            json={"data": [test_transaction]}
        )

        saldo = 10000
        date = datetime.strptime(
            test_transaction['transactie_datum'], '%Y-%m-%dT%H:%M:%S')

        get_closest_saldo = mock.get(
            f"{settings.HHB_SERVICES_URL}/saldo?closest_to={date}",
            json={"data": [{'begindatum': '2023-10-01T00:00:00', 'burger_id': 1,
                            'einddatum': '2023-10-31T00:00:00', 'id': 1, 'saldo': saldo}]}
        )

        mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1",
            json={"data": [{'id': 1, 'burger_id': 1,
                            'rubriek_id': 21, 'zoektermen': 'test'}]}
        )
        # Act
        update_or_create_saldo(test_journaalpost)

        # Assert

        # assert data was only requested once
        assert get_transaction.called == 1
        assert get_closest_saldo.called == 1

        # assert last call was
        assert post_any.last_request.json() == {'begindatum': '2023-07-01', 'burger_id': 1,
                                                'einddatum': '2023-07-31', 'saldo': saldo + test_transaction['bedrag']}


def test_adding_saldo__wwhen_already_exist__should_put_to_existing_saldo(test_request_context):
    with requests_mock.Mocker() as mock:
        # Arrange
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json={"data": []})
        put_any = mock.put(requests_mock.ANY, json={"data": []})

        get_transaction = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids=1",
            json={"data": [test_transaction]}
        )

        saldo = 10000
        date = datetime.strptime(
            test_transaction['transactie_datum'], '%Y-%m-%dT%H:%M:%S')

        get_saldo = mock.get(
            f"{settings.HHB_SERVICES_URL}/saldo?date={date.strftime('%Y-%m-%d')}",
            json={"data": [{'begindatum': '2023-07-01T00:00:00', 'burger_id': 1,
                            'einddatum': '2023-07-31T00:00:00', 'id': 1, 'saldo': saldo}]}
        )

        mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1",
            json={"data": [{'id': 1, 'burger_id': 1,
                            'rubriek_id': 21, 'zoektermen': 'test'}]}
        )
        # Act
        update_or_create_saldo(test_journaalpost)

        # Assert

        # assert data was only requested once
        assert get_transaction.called == 1
        assert get_saldo.called == 1

        # assert last call was
        assert put_any.last_request.json(
        ) == {'id': 1, 'saldo': saldo + test_transaction['bedrag']}


def test_undo_saldo__when_not_exist__should_create_new_saldo_with_reverse_transaction_amount(test_request_context):
    with requests_mock.Mocker() as mock:
        # Arrange
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json={"data": []})
        put_any = mock.put(requests_mock.ANY, json={"data": []})

        get_transaction = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids=1",
            json={"data": [test_transaction]}
        )

        saldo = 10000
        date = datetime.strptime(
            test_transaction['transactie_datum'], '%Y-%m-%dT%H:%M:%S')

        get_closest_saldo = mock.get(
            f"{settings.HHB_SERVICES_URL}/saldo?closest_to={date}",
            json={"data": [{'begindatum': '2023-10-01T00:00:00', 'burger_id': 1,
                            'einddatum': '2023-10-31T00:00:00', 'id': 1, 'saldo': saldo}]}
        )

        mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1",
            json={"data": [{'id': 1, 'burger_id': 1,
                            'rubriek_id': 21, 'zoektermen': 'test'}]}
        )
        # Act
        update_or_create_saldo(test_journaalpost, undo_saldo=True)

        # Assert

        # assert data was only requested once
        assert get_transaction.called == 1
        assert get_closest_saldo.called == 1

        # assert last call was
        assert post_any.last_request.json() == {'begindatum': '2023-07-01', 'burger_id': 1,
                                                'einddatum': '2023-07-31', 'saldo': saldo - test_transaction['bedrag']}


def test_adding_saldo__wwhen_already_exist__should_put_to_existing_saldo_with_reverse_transaction_amount(test_request_context):
    with requests_mock.Mocker() as mock:
        # Arrange
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json={"data": []})
        put_any = mock.put(requests_mock.ANY, json={"data": []})

        get_transaction = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids=1",
            json={"data": [test_transaction]}
        )

        saldo = 10000
        date = datetime.strptime(
            test_transaction['transactie_datum'], '%Y-%m-%dT%H:%M:%S')

        get_saldo = mock.get(
            f"{settings.HHB_SERVICES_URL}/saldo?date={date.strftime('%Y-%m-%d')}",
            json={"data": [{'begindatum': '2023-07-01T00:00:00', 'burger_id': 1,
                            'einddatum': '2023-07-31T00:00:00', 'id': 1, 'saldo': saldo}]}
        )

        mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1",
            json={"data": [{'id': 1, 'burger_id': 1,
                            'rubriek_id': 21, 'zoektermen': 'test'}]}
        )
        # Act
        update_or_create_saldo(test_journaalpost, undo_saldo=True)

        # Assert

        # assert data was only requested once
        assert get_transaction.called == 1
        assert get_saldo.called == 1

        # assert last call was
        assert put_any.last_request.json(
        ) == {'id': 1, 'saldo': saldo - test_transaction['bedrag']}
