""" Test rapportage controller """
from unittest.mock import Mock
import pytest
from decimal import Decimal
from rapportage_service.controllers.rapportageController import RapportageController

@pytest.mark.parametrize("start_date,end_date", [("argaerg", "EFWEFWF"), ("argaerg", "2023-02-28"),("2023-02-28", "EFWEFWF"),               #letters as dates
                                                 ("!@#$%", "!$%^"), ("!@#$%","2023-02-28"),("2023-02-28", "!$%^"),                          #symbols as dates
                                                 ("20230101", "20230101"),("2023-02-28", "20230101"),("20230101", "2023-02-28"),            #numbers as dates
                                                 ("2023-02-30", "2023-02-30"), ("2023-02-28", "2023-02-30"), ("2023-02-30", "2023-02-28"),  #non-existing dates
                                                 ("2023-02-28", "2023-02-20")])                                                             #wrong order
def test_rapportage_controller_invalid_dates(start_date,end_date):
    """ Test if invalid dates are correctly handled"""
    # ARRANGE
    mock_hhbservice_repository = Mock()
    mock_banktransactionservice_repository = Mock()
    sut = RapportageController(mock_hhbservice_repository,mock_banktransactionservice_repository)

    # ACT
    result = sut.get_rapportage([1], [],start_date, end_date)
    # ASSERT
    assert result == ("Invalid date range", 400)


@pytest.mark.parametrize("transactions_info", [([]), ([1242354]),(["EFWEFWF"]),
                                          ([{"burger_id": 1, "rurbiek" : "test", "rekeninghouder" : "test"}]),   
                                          ([{"burger_id": 1, "transaction_id": "test", "rekeninghouder" : "test"}]), 
                                          ([{"burger_id": 1, "transaction_id": "test", "rurbiek" : "test" }]), 
                                          ([{"burger_di": 1, "transaction_id": "test", "rubriek" : "test", "rekeninghouder" : "test" }])])
def test_rapportage_controller_no_burger_transactions(transactions_info):
    """ Test if invalid dates are correctly handled"""
    # ARRANGE
    mock_hhbservice_repository = Mock()
    mock_banktransactionservice_repository = Mock()
    mock_hhbservice_repository.get_transactions_burgers.return_value = transactions_info
    sut = RapportageController(mock_hhbservice_repository,mock_banktransactionservice_repository)

    # ACT
    result = sut.get_rapportage([1],[],"2023-01-01", "2023-01-02")
    # ASSERT
    assert result == ("No data found for burger", 204)


@pytest.mark.parametrize("transactions", [([]), ([1242354]),(["EFWEFWF"]),
                                          ([{"bedrag" : "123"}]),
                                          ([{"transactie_datum" : "test"}])])
def test_rapportage_controller_no_transactions_in_range(transactions):
    """ Test if invalid dates are correctly handled"""
    # ARRANGE
    mock_hhbservice_repository = Mock()
    mock_banktransactionservice_repository = Mock()
    mock_hhbservice_repository.get_transactions_burgers.return_value = [{"burger_id": 1, "transaction_id" : 12, "rubriek" : "test", "rekeninghouder": "test"}]
    mock_banktransactionservice_repository.get_transacties_in_range.return_value = transactions
    sut = RapportageController(mock_hhbservice_repository,mock_banktransactionservice_repository)

    # ACT
    result = sut.get_rapportage([1],[],"2023-01-01", "2023-01-02")
    # ASSERT
    assert result == ("No data found in range", 204)


def test_rapportage_rapportage_burger():
    """ Test if invalid dates are correctly handled"""
    # ARRANGE
    mock_hhbservice_repository = Mock()
    transaction_info_1 = {"burger_id": 1, "transaction_id" : 11, "rubriek" : "gas", "rekeninghouder": "test1"}
    transaction_info_2 = {"burger_id": 1, "transaction_id" : 12, "rubriek" : "gas", "rekeninghouder": "test2"}
    transaction_info_3 = {"burger_id": 1, "transaction_id" : 13, "rubriek" : "loon", "rekeninghouder": "test3"}
    transaction_info_4 = {"burger_id": 1, "transaction_id" : 14, "rubriek" : "toeslagen", "rekeninghouder": "test4"}
    transaction_info_5 = {"burger_id": 1, "transaction_id" : 15, "rubriek" : "toeslagen", "rekeninghouder": "test4"}
    transaction_info_6 = {"burger_id": 1, "transaction_id" : 16, "rubriek" : "toeslagen", "rekeninghouder": "test4"}
    transaction_info_7 = {"burger_id": 1, "transaction_id" : 17, "rubriek" : "elektra", "rekeninghouder": "test2"}

    mock_hhbservice_repository.get_transactions_burgers.return_value = [transaction_info_1,transaction_info_2,transaction_info_3,transaction_info_4,transaction_info_5,transaction_info_6, transaction_info_7]
    mock_banktransactionservice_repository = Mock()
    
    transaction_1 = {"uuid" : 11, "transactie_datum" : "2023-12-11", "bedrag": "-11125"}
    transaction_2 = {"uuid" : 12, "transactie_datum" : "2023-12-12", "bedrag": "-11225"}
    transaction_3 = {"uuid" : 13, "transactie_datum" : "2023-12-13", "bedrag": "11325"}
    transaction_4 = {"uuid" : 14, "transactie_datum" : "2023-12-14", "bedrag": "11425"}
    transaction_5 = {"uuid" : 17, "transactie_datum" : "2023-12-15", "bedrag": "-100"}

    mock_banktransactionservice_repository.get_transacties_in_range.return_value = [transaction_1, transaction_2, transaction_3, transaction_4, transaction_5]

    total_in = 227.50
    total_out = -224.50
    total = 3
    start = "2023-01-01"
    end = "2023-12-30"
    burger_ids = [1]

    sut = RapportageController(mock_hhbservice_repository,mock_banktransactionservice_repository)

    # ACT
    result, response_code = sut.get_rapportage(burger_ids,[],start, end)
    # ASSERT
    assert response_code == 200
    assert result["data"][0] == {"inkomsten": [{"rubriek": "loon",
                                             "transacties": [{"rekeninghouder": "test3", "transactie_datum": "2023-12-13", "bedrag": Decimal(113.25)}]},
                                            {"rubriek": "toeslagen",
                                              "transacties": [{"rekeninghouder": "test4", "transactie_datum": "2023-12-14", "bedrag": Decimal(114.25)}]}],
                            "uitgaven" : [{"rubriek": "gas",
                                           "transacties": [
                                                    {"rekeninghouder": "test1", "transactie_datum": "2023-12-11", "bedrag": Decimal(-111.25)},
                                                    {"rekeninghouder": "test2", "transactie_datum": "2023-12-12", "bedrag": Decimal(-112.25)}]},
                                        {"rubriek": "elektra",
                                         "transacties": [{"rekeninghouder": "test2", "transactie_datum": "2023-12-15", "bedrag": Decimal(-1)}]}],
                            "totaal_inkomsten": total_in,
                            "totaal_uitgaven": total_out,
                            "start_datum": start,
                            "eind_datum": end,
                            "totaal": total ,
                            "burger_id": burger_ids[0] }
    
def test_rapportage_all_burgers_rapportage():
    """ Test if invalid dates are correctly handled"""
    # ARRANGE
    mock_hhbservice_repository = Mock()
    transaction_info_1 = {"burger_id": 1, "transaction_id" : 11, "rubriek" : "gas", "rekeninghouder": "test1"}
    transaction_info_2 = {"burger_id": 2, "transaction_id" : 12, "rubriek" : "gas", "rekeninghouder": "test2"}
    transaction_info_3 = {"burger_id": 3, "transaction_id" : 13, "rubriek" : "loon", "rekeninghouder": "test3"}
    transaction_info_4 = {"burger_id": 4, "transaction_id" : 14, "rubriek" : "toeslagen", "rekeninghouder": "test4"}
    transaction_info_5 = {"burger_id": 5, "transaction_id" : 15, "rubriek" : "toeslagen", "rekeninghouder": "test4"}
    transaction_info_6 = {"burger_id": 6, "transaction_id" : 16, "rubriek" : "toeslagen", "rekeninghouder": "test4"}
    transaction_info_7 = {"burger_id": 7, "transaction_id" : 17, "rubriek" : "elektra", "rekeninghouder": "test2"}

    mock_hhbservice_repository.get_transactions_burgers.return_value = [transaction_info_1,transaction_info_2,transaction_info_3,transaction_info_4,transaction_info_5,transaction_info_6, transaction_info_7]
    mock_banktransactionservice_repository = Mock()
    
    transaction_1 = {"uuid" : 11, "transactie_datum" : "2023-12-11", "bedrag": "-11125"}
    transaction_2 = {"uuid" : 12, "transactie_datum" : "2023-12-12", "bedrag": "-11225"}
    transaction_3 = {"uuid" : 13, "transactie_datum" : "2023-12-13", "bedrag": "11325"}
    transaction_4 = {"uuid" : 14, "transactie_datum" : "2023-12-14", "bedrag": "11425"}
    transaction_5 = {"uuid" : 17, "transactie_datum" : "2023-12-15", "bedrag": "-100"}

    mock_banktransactionservice_repository.get_transacties_in_range.return_value = [transaction_1, transaction_2, transaction_3, transaction_4, transaction_5]

    total_in = 227.50
    total_out = -224.50
    total = 3
    start = "2023-01-01"
    end = "2023-12-30"

    sut = RapportageController(mock_hhbservice_repository,mock_banktransactionservice_repository)

    # ACT
    result, response_code = sut.get_rapportage([],[],start, end)
    # ASSERT
    assert response_code == 200
    assert result["data"][0] == {"inkomsten": [{"rubriek": "loon",
                                             "transacties": [{"rekeninghouder": "test3", "transactie_datum": "2023-12-13", "bedrag": Decimal(113.25)}]},
                                            {"rubriek": "toeslagen",
                                              "transacties": [{"rekeninghouder": "test4", "transactie_datum": "2023-12-14", "bedrag": Decimal(114.25)}]}],
                            "uitgaven" : [{"rubriek": "gas",
                                           "transacties": [
                                                    {"rekeninghouder": "test1", "transactie_datum": "2023-12-11", "bedrag": Decimal(-111.25)},
                                                    {"rekeninghouder": "test2", "transactie_datum": "2023-12-12", "bedrag": Decimal(-112.25)}]},
                                        {"rubriek": "elektra",
                                         "transacties": [{"rekeninghouder": "test2", "transactie_datum": "2023-12-15", "bedrag": Decimal(-1)}]}],
                            "totaal_inkomsten": total_in,
                            "totaal_uitgaven": total_out,
                            "start_datum": start,
                            "eind_datum": end,
                            "totaal": total ,
                            "burger_id": None }
    
def test_rapportage_rapportage_more_burger():
    """ Test if invalid dates are correctly handled"""
    # ARRANGE
    mock_hhbservice_repository = Mock()
    transaction_info_1 = {"burger_id": 1, "transaction_id" : 11, "rubriek" : "gas", "rekeninghouder": "test1"}
    transaction_info_2 = {"burger_id": 2, "transaction_id" : 12, "rubriek" : "gas", "rekeninghouder": "test2"}
    transaction_info_3 = {"burger_id": 1, "transaction_id" : 13, "rubriek" : "loon", "rekeninghouder": "test3"}
    transaction_info_4 = {"burger_id": 1, "transaction_id" : 14, "rubriek" : "toeslagen", "rekeninghouder": "test4"}
    transaction_info_5 = {"burger_id": 2, "transaction_id" : 15, "rubriek" : "toeslagen", "rekeninghouder": "test4"}
    transaction_info_6 = {"burger_id": 2, "transaction_id" : 16, "rubriek" : "toeslagen", "rekeninghouder": "test4"}
    transaction_info_7 = {"burger_id": 2, "transaction_id" : 17, "rubriek" : "elektra", "rekeninghouder": "test2"}

    mock_hhbservice_repository.get_transactions_burgers.return_value = [transaction_info_1,transaction_info_2,transaction_info_3,transaction_info_4,transaction_info_5,transaction_info_6, transaction_info_7]
    mock_banktransactionservice_repository = Mock()
    
    transaction_1 = {"uuid" : 11, "transactie_datum" : "2023-12-11", "bedrag": "-11125"}
    transaction_2 = {"uuid" : 12, "transactie_datum" : "2023-12-12", "bedrag": "-11225"}
    transaction_3 = {"uuid" : 13, "transactie_datum" : "2023-12-13", "bedrag": "11325"}
    transaction_4 = {"uuid" : 14, "transactie_datum" : "2023-12-14", "bedrag": "11425"}
    transaction_5 = {"uuid" : 15, "transactie_datum" : "2023-12-14", "bedrag": "11425"}
    transaction_6 = {"uuid" : 16, "transactie_datum" : "2023-12-14", "bedrag": "11425"}
    transaction_7 = {"uuid" : 17, "transactie_datum" : "2023-12-15", "bedrag": "-100"}

    mock_banktransactionservice_repository.get_transacties_in_range.return_value = [transaction_1, transaction_2, transaction_3, transaction_4, transaction_5, transaction_6, transaction_7]

    total_in_1 = 227.50
    total_out_1 = -111.25
    total_1 = 116.25

    total_in_2 = 228.50
    total_out_2 = -113.25
    total_2 = 115.25

    start = "2023-01-01"
    end = "2023-12-30"
    burger_ids = [1,2]

    sut = RapportageController(mock_hhbservice_repository,mock_banktransactionservice_repository)

    # ACT
    result, response_code = sut.get_rapportage(burger_ids,[],start, end)
    # ASSERT
    assert response_code == 200
    assert result["data"][0] == {"inkomsten": [{"rubriek": "loon",
                                             "transacties": [{"rekeninghouder": "test3", "transactie_datum": "2023-12-13", "bedrag": Decimal(113.25)}]},
                                            {"rubriek": "toeslagen",
                                              "transacties": [{"rekeninghouder": "test4", "transactie_datum": "2023-12-14", "bedrag": Decimal(114.25)}]}],
                            "uitgaven" : [{"rubriek": "gas",
                                           "transacties": [
                                                    {"rekeninghouder": "test1", "transactie_datum": "2023-12-11", "bedrag": Decimal(-111.25)}]}],
                            "totaal_inkomsten": total_in_1,
                            "totaal_uitgaven": total_out_1,
                            "start_datum": start,
                            "eind_datum": end,
                            "totaal": total_1 ,
                            "burger_id": burger_ids[0] }
    
    assert result["data"][1] == {"inkomsten": [{"rubriek": "toeslagen",
                                              "transacties": [{"rekeninghouder": "test4", "transactie_datum": "2023-12-14", "bedrag": Decimal(114.25)},
                                                              {"rekeninghouder": "test4", "transactie_datum": "2023-12-14", "bedrag": Decimal(114.25)}]}],
                            "uitgaven" : [{"rubriek": "gas",
                                           "transacties": [
                                                    {"rekeninghouder": "test2", "transactie_datum": "2023-12-12", "bedrag": Decimal(-112.25)}]},
                                        {"rubriek": "elektra",
                                         "transacties": [{"rekeninghouder": "test2", "transactie_datum": "2023-12-15", "bedrag": Decimal(-1)}]}],
                            "totaal_inkomsten": total_in_2,
                            "totaal_uitgaven": total_out_2,
                            "start_datum": start,
                            "eind_datum": end,
                            "totaal": total_2 ,
                            "burger_id": burger_ids[1] }