""" Test rapportage controller """
from unittest.mock import Mock
from rapportage_service.controllers.saldoController import SaldoController


def test_saldo_controller_no_burger_ids():
    """ Test if invalid dates are correctly handled"""
    # ARRANGE
    burger_ids = None
    date = "2021-01-01"
    saldo = 12423

    mock_hhbservice_repository = Mock()
    mock_banktransactionservice_repository = Mock()
    sut = SaldoController(mock_hhbservice_repository,
                          mock_banktransactionservice_repository)
    mock_banktransactionservice_repository.get_saldo.return_value = saldo
    mock_hhbservice_repository.get_journalentries_rubrics.return_value = []

    # ACT
    result = sut.get_saldos(burger_ids, date)
    # ASSERT
    assert result == {"saldo": saldo}
    assert mock_banktransactionservice_repository.get_saldo.called
    mock_banktransactionservice_repository.get_saldo.assert_called_with(
        date, transactions=None, exclude=None)


def test_saldo_controller_burger_ids():
    """ Test if invalid dates are correctly handled"""
    # ARRANGE
    burger_ids = [12, 13]
    date = "2021-01-01"
    saldo = 12423
    transaction_ids_json = [
        {"transaction_id": 10},
        {"transaction_id": 1},
        {"transaction_id": 20},
        {"transaction_id": 13}
    ]
    transaction_ids_list = [10, 1, 20, 13]

    mock_hhbservice_repository = Mock()
    mock_banktransactionservice_repository = Mock()
    sut = SaldoController(mock_hhbservice_repository,
                          mock_banktransactionservice_repository)
    mock_banktransactionservice_repository.get_saldo.return_value = saldo
    mock_hhbservice_repository.get_transaction_ids_burgers.return_value = transaction_ids_json

    # ACT
    result = sut.get_saldos(burger_ids, date)
    # ASSERT
    assert result == {"saldo": saldo}
    assert mock_banktransactionservice_repository.get_saldo.called
    mock_banktransactionservice_repository.get_saldo.assert_called_with(
        date, transactions=transaction_ids_list, exclude=None)
    assert mock_hhbservice_repository.get_transaction_ids_burgers.called
    mock_hhbservice_repository.get_transaction_ids_burgers.assert_called_with(
        burger_ids)


def test_saldo_controller_burger_ids_no_transactions():
    """ Test if invalid dates are correctly handled"""
    # ARRANGE
    burger_ids = [12, 13]
    date = "2021-01-01"
    saldo = 0
    transaction_ids_json = []

    mock_hhbservice_repository = Mock()
    mock_banktransactionservice_repository = Mock()
    sut = SaldoController(mock_hhbservice_repository,
                          mock_banktransactionservice_repository)
    mock_hhbservice_repository.get_transaction_ids_burgers.return_value = transaction_ids_json

    # ACT
    result = sut.get_saldos(burger_ids, date)

    # ASSERT
    assert result == {"saldo": saldo}
    assert mock_hhbservice_repository.get_transaction_ids_burgers.called
    mock_hhbservice_repository.get_transaction_ids_burgers.assert_called_with(
        burger_ids)
