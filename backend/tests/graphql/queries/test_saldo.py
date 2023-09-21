
from freezegun import freeze_time
import pytest

import requests_mock

from hhb_backend.graphql import settings

mock_date = "2021-01-01"
saldo = 13427
saldo_expected = "134.27"

@freeze_time(mock_date)
def test_saldo_success_no_burger_ids(client):
    with requests_mock.Mocker() as rm:
        #Arrange

        rm1 = rm.get(f"{settings.RAPPORTAGE_SERVICE_URL}/saldo?date=2021-01-01",
            json={'data': {'saldo': saldo}})
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")

        #Act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query saldo($date: Date!) {
                    saldo(date:$date) {
                        saldo
                    }
                }''',
                "variables": {"date": mock_date}},
            content_type='application/json'
        )

        #Assert
        assert rm1.call_count == 1
        assert rm2.call_count == 1
        assert response.json == {
            'data': {'saldo': { 'saldo' :saldo_expected}}}
        
@freeze_time(mock_date)
def test_saldo_success_empty_burger_ids(client):
    with requests_mock.Mocker() as rm:
        #Arrange
        burgers=[]

        rm1 = rm.get(f"{settings.RAPPORTAGE_SERVICE_URL}/saldo?date=2021-01-01",
            json={'data': {'saldo': saldo}})
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")

        #Act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query saldo($burgers:[Int!]!, $date: Date!) {
                    saldo(burgerIds: $burgers, date:$date) {
                        saldo
                    }
                }''',
                "variables": {"date": mock_date, "burgers": burgers}},
            content_type='application/json'
        )

        #Assert
        assert rm1.call_count == 1
        assert rm2.call_count == 1
        assert response.json == {
            'data': {'saldo': { 'saldo' :saldo_expected}}}
        
@freeze_time(mock_date)
def test_saldo_success_with_one_burger_ids(client):
    with requests_mock.Mocker() as rm:
        #Arrange
        burgers=[1]

        rm1 = rm.get(f"{settings.RAPPORTAGE_SERVICE_URL}/saldo?date=2021-01-01",
            json={'data': {'saldo': saldo}})
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")

        #Act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query saldo($burgers:[Int!]!, $date: Date!) {
                    saldo(burgerIds: $burgers, date:$date) {
                        saldo
                    }
                }''',
                "variables": {"date": mock_date, "burgers": burgers}},
            content_type='application/json'
        )

        #Assert
        assert rm1.call_count == 1
        assert rm2.call_count == 1
        assert response.json == {
            'data': {'saldo': { 'saldo' :saldo_expected}}}
        
@freeze_time(mock_date)
def test_saldo_success_with_burger_ids(client):
    with requests_mock.Mocker() as rm:
        #Arrange
        burgers=[1,2,25,1323526,1243464578]

        rm1 = rm.get(f"{settings.RAPPORTAGE_SERVICE_URL}/saldo?date=2021-01-01",
            json={'data': {'saldo': saldo}})
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")

        #Act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query saldo($burgers:[Int!]!, $date: Date!) {
                    saldo(burgerIds: $burgers, date:$date) {
                        saldo
                    }
                }''',
                "variables": {"date": mock_date, "burgers": burgers}},
            content_type='application/json'
        )

        #Assert
        assert rm1.call_count == 1
        assert rm2.call_count == 1
        assert response.json == {
            'data': {'saldo': { 'saldo' :saldo_expected}}}

@freeze_time(mock_date)
def test_saldo_error_with_wrong_burger_ids(client):
    with requests_mock.Mocker() as rm:
        #Arrange
        burgers=["etaetgae", "aewrtga", True, False, 1244235]

        rm1 = rm.get(f"{settings.RAPPORTAGE_SERVICE_URL}/saldo?date=2021-01-01",
            json={'data': {'saldo': saldo}})
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")

        #Act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query saldo($burgers:[Int!]!, $date: Date!) {
                    saldo(burgerIds: $burgers, date:$date) {
                        saldo
                    }
                }''',
                "variables": {"date": mock_date, "burgers": burgers}},
            content_type='application/json'
        )

        #Assert
        assert rm1.call_count == 0
        assert rm2.call_count == 0
        assert "Variable '$burgers' got invalid value" in str(response.json)

@freeze_time(mock_date)
def test_saldo_error_with_no_date(client):
    with requests_mock.Mocker() as rm:
        #Arrange
        burgers=[]

        rm1 = rm.get(f"{settings.RAPPORTAGE_SERVICE_URL}/saldo?date=2021-01-01",
            json={'data': {'saldo': saldo}})
        rm2 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")

        #Act
        response = client.post(
            "/graphql",
            json={
                "query": '''
                query saldo($burgers:[Int!]!) {
                    saldo(burgerIds: $burgers) {
                        saldo
                    }
                }''',
                "variables": {"burgers": burgers}},
            content_type='application/json'
        )

        #Assert
        assert rm1.call_count == 0
        assert rm2.call_count == 0
        assert "argument 'date' of type 'Date!' is required, but it was not provided" in str(response.json)