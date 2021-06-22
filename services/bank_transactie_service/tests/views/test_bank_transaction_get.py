""" Test GET /banktransactions/(<banktransaction_id>/) """
import json
import pytest

from models.customer_statement_message import CustomerStatementMessage
from core_service.utils import row2dict
from tests.factories import customer_statement_message_factory
from datetime import date


def test_bank_transaction_get_success_all(client, bank_transaction_factory):
    """ Test /banktransactions/(<bank_transaction_id>) path """
    bank_transaction1 = bank_transaction_factory.createBankTransaction(statement_line="stmt1")
    bank_transaction2 = bank_transaction_factory.createBankTransaction(statement_line="stmt2")
    response = client.get(f'/banktransactions/')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["statement_line"] == bank_transaction1.statement_line
    assert response.json["data"][1]["statement_line"] == bank_transaction2.statement_line


def test_bank_transaction_get_success_one(client, bank_transaction_factory):
    """ Test /banktransactions/(<bank_transaction_id>) path """
    bank_transaction1 = bank_transaction_factory.createBankTransaction(statement_line="stmt1")
    response = client.get(f'/banktransactions/{bank_transaction1.id}')
    assert response.status_code == 200
    assert response.json["data"]["statement_line"] == bank_transaction1.statement_line


def test_bank_transaction_get_success_filter_csms(client, bank_transaction_factory):
    """ Test /banktransactions/(<bank_transaction_id>) path """
    bank_transaction1 = bank_transaction_factory.createBankTransaction(statement_line="stmt1")
    bank_transaction2 = bank_transaction_factory.createBankTransaction(statement_line="stmt1")
    assert bank_transaction1.customer_statement_message_id != bank_transaction2.customer_statement_message_id
    response = client.get(f'/banktransactions/?filter_csms={bank_transaction1.customer_statement_message_id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["id"] == bank_transaction1.id


def test_bank_transaction_get_success_filter_is_geboekt(client, bank_transaction_factory):
    """ Test /banktransactions/(<bank_transaction_id>) path """
    bank_transaction1 = bank_transaction_factory.createBankTransaction(is_geboekt=None)
    bank_transaction2 = bank_transaction_factory.createBankTransaction(is_geboekt=False)
    bank_transaction3 = bank_transaction_factory.createBankTransaction(is_geboekt=True)

    response = client.get(f'/banktransactions/?filter_is_geboekt=false')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2

    assert response.json["data"][0]["id"] == bank_transaction1.id
    assert response.json["data"][1]["id"] == bank_transaction2.id
    assert bank_transaction3.id not in [bt["id"] for bt in response.json["data"]]

    response = client.get(f'/banktransactions/?filter_is_geboekt=true')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["id"] == bank_transaction3.id


def test_bank_transaction_get_success_filter_is_geboekt_and_csm(client, bank_transaction_factory, csm_factory):
    """ Test /banktransactions/(<bank_transaction_id>) path """
    csm1 = csm_factory.create_customer_statement_message()
    csm2 = csm_factory.create_customer_statement_message()
    bank_transaction11 = bank_transaction_factory.createBankTransaction(customer_statement_message_id=csm1.id,
                                                                        is_geboekt=None)
    bank_transaction12 = bank_transaction_factory.createBankTransaction(customer_statement_message_id=csm1.id,
                                                                        is_geboekt=None)
    bank_transaction13 = bank_transaction_factory.createBankTransaction(customer_statement_message_id=csm1.id,
                                                                        is_geboekt=True)
    bank_transaction21 = bank_transaction_factory.createBankTransaction(customer_statement_message_id=csm2.id,
                                                                        is_geboekt=None)

    response = client.get(f'/banktransactions/?filter_csms={csm1.id}&filter_is_geboekt=false')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2

    assert response.json["data"][0]["id"] == bank_transaction11.id
    assert response.json["data"][1]["id"] == bank_transaction12.id

    assert bank_transaction13.id not in [bt["id"] for bt in response.json["data"]]
    assert bank_transaction21.id not in [bt["id"] for bt in response.json["data"]]


class TestBankTransactionComplexFilter:
    """ Test /banktransactions/?filters(<filters>) path """
    filters = {
        "OR": {
            "AND": {"is_geboekt": True, "is_credit": True},
            "id": {"IN": [4, 6]},
            "transactie_datum": {
                "BETWEEN": ["2021-01-01T00:00:00", "2021-01-10T00:00:00"]
            },
        }
    }

    @pytest.fixture
    def setup(self, bank_transaction_factory):
        self.bt_tt = bank_transaction_factory.createBankTransaction(is_credit=True, is_geboekt=True)
        self.bt_tf = bank_transaction_factory.createBankTransaction(is_credit=True, is_geboekt=False)
        self.bt_ft = bank_transaction_factory.createBankTransaction(is_credit=False, is_geboekt=True)
        self.bt_ff = bank_transaction_factory.createBankTransaction(is_credit=False, is_geboekt=False)

        self.bt_bedrag_30000 = bank_transaction_factory.createBankTransaction(bedrag=30000)
        self.bt_bedrag_44500 = bank_transaction_factory.createBankTransaction(bedrag=44500)
        self.bt_bedrag_123456 = bank_transaction_factory.createBankTransaction(bedrag=123456)

        self.bt_td_20210102 = bank_transaction_factory.createBankTransaction(transactie_datum=date(2021, 1, 2))
        self.bt_td_20210103 = bank_transaction_factory.createBankTransaction(transactie_datum=date(2021, 1, 3))
        self.bt_td_20211231 = bank_transaction_factory.createBankTransaction(transactie_datum=date(2021, 12, 31))

    def __get_response(self, client, filter):
        return client.get(f"/banktransactions?filters={json.dumps(filter)}")

    def __resp_ids(self, resp):
        return sorted([bt['id'] for bt in resp.json['data']])

    def test_bool(self, client, setup):
        filter = {
            "is_geboekt": True
        }
        expected_bt_ids = [self.bt_tt.id, self.bt_ft.id]

        resp = self.__get_response(client=client, filter=filter)
        assert resp.status_code == 200
        assert self.__resp_ids(resp=resp) == expected_bt_ids

    def test_EQ(self, client, setup):
        filter_1 = {
            "bedrag": {
                "EQ": "30000"
            }
        }
        filter_2 = {
            "bedrag": {
                "EQ": 30000
            }
        }
        filters = [filter_1, filter_2]

        for filter in filters:
            expected_bt_ids = [self.bt_bedrag_30000.id]
            resp = self.__get_response(client=client, filter=filter)
            assert resp.status_code == 200
            assert self.__resp_ids(resp=resp) == expected_bt_ids

    def test_NEQ(self, client, setup):
        filter_1 = {
            "bedrag": {
                "NEQ": "30000"
            }
        }
        filter_2 = {
            "bedrag": {
                "NEQ": 30000
            }
        }
        filters = [filter_1, filter_2]

        for filter in filters:
            expected_bt_ids = [1, 2, 3, 4, 6, 7, 8, 9, 10]
            resp = self.__get_response(client=client, filter=filter)
            assert resp.status_code == 200
            assert self.__resp_ids(resp=resp) == expected_bt_ids

    def test_GT(self, client, setup):
        filter_1 = {
            "bedrag": {
                "GT": "100000"
            }
        }
        filter_2 = {
            "bedrag": {
                "GT": 100000
            }
        }
        filters = [filter_1, filter_2]

        for filter in filters:
            expected_bt_ids = [self.bt_bedrag_123456.id]
            resp = self.__get_response(client=client, filter=filter)
            assert resp.status_code == 200
            assert self.__resp_ids(resp=resp) == expected_bt_ids

    def test_GTE(self, client, setup):
        filter_1 = {
            "bedrag": {
                "GTE": "123456"
            }
        }
        filter_2 = {
            "bedrag": {
                "GTE": 123456
            }
        }
        filters = [filter_1, filter_2]

        for filter in filters:
            expected_bt_ids = [self.bt_bedrag_123456.id]
            resp = self.__get_response(client=client, filter=filter)
            assert resp.status_code == 200
            assert self.__resp_ids(resp=resp) == expected_bt_ids

    def test_LT(self, client, setup):
        filter_1 = {
            "bedrag": {
                "LT": "101"
            }
        }
        filter_2 = {
            "bedrag": {
                "LT": 101
            }
        }
        filters = [filter_1, filter_2]

        for filter in filters:
            expected_bt_ids = [1, 2, 3, 4, 8, 9, 10]
            resp = self.__get_response(client=client, filter=filter)
            assert resp.status_code == 200
            assert self.__resp_ids(resp=resp) == expected_bt_ids

    def test_LTE(self, client, setup):
        filter_1 = {
            "bedrag": {
                "LTE": "100"
            }
        }
        filter_2 = {
            "bedrag": {
                "LTE": 100
            }
        }
        filters = [filter_1, filter_2]

        for filter in filters:
            expected_bt_ids = [1, 2, 3, 4, 8, 9, 10]
            resp = self.__get_response(client=client, filter=filter)
            assert resp.status_code == 200
            assert self.__resp_ids(resp=resp) == expected_bt_ids
    
    def test_IN(self, client, setup):
        filter_1 = {
            "bedrag": {
                "IN": [30000, 44500, 123456]
            }
        }
        filter_2 = {
            "bedrag": {
                "IN": ["30000", "44500", "123456"]
            }
        }
        filters = [filter_1, filter_2]
        
        for filter in filters:
            expected_bt_ids = [self.bt_bedrag_30000.id, self.bt_bedrag_44500.id, self.bt_bedrag_123456.id]
            resp = self.__get_response(client=client, filter=filter)
            assert resp.status_code == 200
            assert self.__resp_ids(resp=resp) == expected_bt_ids

    def test_IN_date(self, client, setup):
        filter = {
            "transactie_datum": {
                "IN": ["2021-01-02", "2021-01-03", "2021-12-31"]
            }
        }
        expected_bt_ids = [self.bt_td_20210102.id, self.bt_td_20210103.id, self.bt_td_20211231.id]
        resp = self.__get_response(client=client, filter=filter)
        assert resp.status_code == 200
        assert self.__resp_ids(resp=resp) == expected_bt_ids

    def test_NOTIN(self, client, setup):
        filter = {
            "tegen_rekening": {
                "NOTIN": ["NL02ABNA0123456789"]
            }
        }
        expected_bt_ids = []
        resp = self.__get_response(client=client, filter=filter)
        assert resp.status_code == 200
        assert self.__resp_ids(resp=resp) == expected_bt_ids

    def test_NOTIN_date(self, client, setup):
        filter = {
            "transactie_datum": {
                "NOTIN": ["2021-01-02", "2021-01-03", "2021-12-31"]
            }
        }
        expected_bt_ids = [1, 2, 3, 4, 5, 6, 7]
        resp = self.__get_response(client=client, filter=filter)
        assert resp.status_code == 200
        assert self.__resp_ids(resp=resp) == expected_bt_ids

    def test_BETWEEN(self, client, setup):
        filter_1 = {
            "bedrag": {
                "BETWEEN": ["20000", "40000"]
            }
        }
        filter_2 = {
            "bedrag": {
                "BETWEEN": [20000, 40000]
            }
        }
        filters = [filter_1, filter_2]

        for filter in filters:
            expected_bt_ids = [self.bt_bedrag_30000.id]
            resp = self.__get_response(client=client, filter=filter)
            assert resp.status_code == 200
            assert self.__resp_ids(resp=resp) == expected_bt_ids

    def test_BETWEEN_dates(self, client, setup):
        filter = {
            "transactie_datum": {
                "BETWEEN": ["2021-01-01", "2021-01-04"]
            }
        }
        expected_bt_ids = [self.bt_td_20210102.id, self.bt_td_20210103.id]
        resp = self.__get_response(client=client, filter=filter)
        assert resp.status_code == 200
        assert self.__resp_ids(resp=resp) == expected_bt_ids

    def test_AND(self, client, setup):
        filter = {
            "AND": {
                "is_credit": True,
                "is_geboekt": True
            }
        }
        expected_bt_ids = [self.bt_tt.id]
        resp = self.__get_response(client=client, filter=filter)
        assert resp.status_code == 200
        assert self.__resp_ids(resp=resp) == expected_bt_ids

    def test_OR(self, client, setup):
        filter = {
            "OR": {
                "bedrag": 30000,
                "transactie_datum": "2021-01-03"
            }
        }
        expected_bt_ids = [self.bt_bedrag_30000.id, self.bt_td_20210103.id]
        resp = self.__get_response(client=client, filter=filter)
        assert resp.status_code == 200
        assert self.__resp_ids(resp=resp) == expected_bt_ids

    def test_AND_OR_combination(self, client, setup):
        filter = {
            "OR": {
                "AND": {
                    "is_credit": True,
                    "is_geboekt": True
                },
                "OR": {
                    "transactie_datum": "2021-01-02",
                    "bedrag": 30000
                }
            }
        }
        expected_bt_ids = [self.bt_tt.id, self.bt_bedrag_30000.id, self.bt_td_20210102.id]
        resp = self.__get_response(client=client, filter=filter)
        assert resp.status_code == 200
        assert self.__resp_ids(resp=resp) == expected_bt_ids

    def test_complex(self, client, setup):
        filter = {
            "OR": {
                "OR": {
                    "bedrag": {
                        "BETWEEN": ["20000", "40000"]
                    },
                    "transactie_datum": {
                        "IN": ["2021-01-02", "2021-01-03"]
                    }
                },
                "is_geboekt": True,
                "AND": {
                    "OR": {
                        "id": {
                            "GT": 9
                        },
                        "AND": {
                            "is_geboekt": False,
                            "is_credit": False
                        }
                    },
                }
            }
        }
        expected_bt_ids = [1, 3, 4, 5, 8, 9, 10]
        resp = self.__get_response(client=client, filter=filter)
        assert resp.status_code == 200
        assert self.__resp_ids(resp=resp) == expected_bt_ids
