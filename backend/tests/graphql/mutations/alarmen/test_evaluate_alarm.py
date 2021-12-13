# from datetime import datetime
# import requests_mock
# from hhb_backend.graphql import settings
# from freezegun import freeze_time
# from hhb_backend.graphql.mutations.alarmen.evaluate_alarm import EvaluateAlarm
# import pytest

# alarm_id = "00943958-8b93-4617-aa43-669a9016aad9"
# afspraak_id = 19
# journaalpost_id = 1
# transaction_id = 10
# banktransactie_id = 100
# alarm = {
#     "id": alarm_id,
#     "isActive": True,
#     "gebruikerEmail":"other@mail.nl",
#     "afspraakId": 19,
#     "datum":"2021-12-06",
#     "datumMargin": 5,
#     "bedrag": "12500",
#     "bedragMargin":"1000"
# }
# afspraak = {
#     "id": afspraak_id,
#     "aantal_betalingen": None,
#     "afdeling_id": None,
#     "bedrag": 120,
#     "betaalinstructie": {
#         "by_day": ["Wednesday", "Friday"],
#         "start_date": "2019-01-01"
#     },
#     "burger_id": 2,
#     "credit": False,
#     "journaalposten": [journaalpost_id]
# }
# journaalpost = {
#     "afspraak_id": afspraak_id,
#     "grootboekrekening_id": "BEivKapProPok",
#     "id": journaalpost_id,
#     "is_automatisch_geboekt": True,
#     "transaction_id": transaction_id
# }
# banktransactie = {
#     "id": banktransactie_id,
#     "bedrag": 120,
#     "customer_statement_message_id": 15,
#     "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
#     "is_credit": False,
#     "is_geboekt": True,
#     "statement_line": "190101D-1195.20NMSC028",
#     "tegen_rekening": "NL83ABNA1927261899",
#     "transactie_datum": "2021-12-01"
# }

# @freeze_time("2021-12-01")
# @pytest.mark.parametrize(
#     ["expected", "betaalinstructie"], [
#     (datetime(2021,12, 6), {"by_day": ["Monday"]}),
#     (datetime(2021,12, 7), {"by_day": ["Tuesday"]}),
#     (datetime(2021,12, 8), {"by_day": ["Wednesday"]}),
#     (datetime(2021,12, 2), {"by_day": ["Thursday"]}),
#     (datetime(2021,12, 3), {"by_day": ["Friday"]}),
#     (datetime(2021,12, 4), {"by_day": ["Saturday"]}),
#     (datetime(2021,12, 5), {"by_day": ["Sunday"]}),
# ])
# def test_generateNextAlarmDate_weekly(expected: datetime, betaalinstructie):
#     afspraak = {
#         "betaalinstructie": betaalinstructie
#     }
#     next_alarm_date = EvaluateAlarm.generateNextAlarmInSequence(afspraak)
#     assert next_alarm_date == expected.date()

# @freeze_time("2021-12-01")
# @pytest.mark.parametrize(
#     ["expected", "betaalinstructie"], [
#     (datetime(2022,1, 1), {"by_month": [1], "by_month_day": [1]}),
#     (datetime(2022,3, 10), {"by_month": [3], "by_month_day": [10, 15, 30]}),
#     (datetime(2022,12, 1), {"by_month": [12], "by_month_day": [1]}),
#     (datetime(2022,3, 1), {"by_month": [3,4,5,6,7,8,9,10], "by_month_day": [1]}),
#     (datetime(2022,11, 30), {"by_month": [11], "by_month_day": [30]}),
#     (datetime(2021,12, 2), {"by_month": [12], "by_month_day": [1,2,3,4,5]}),
# ])
# def test_generateNextAlarmDate_monthly(expected: datetime, betaalinstructie):
#     afspraak = {
#         "betaalinstructie": betaalinstructie
#     }
#     next_alarm_date = EvaluateAlarm.generateNextAlarmInSequence(afspraak)
#     assert next_alarm_date == expected.date()

# @freeze_time("2021-12-06")
# def test_evaluate_alarm_illigal_betaalinstructie_combination(client):
#     with requests_mock.Mocker() as rm:
#         # arrange
#         afspraak = {
#             "id": afspraak_id,
#             "aantal_betalingen": None,
#             "afdeling_id": None,
#             "bedrag": 120,
#             "betaalinstructie": {
#                 "by_day": ["Wednesday", "Friday"],
#                 "by_month": [1],
#                 "by_month_day": [1],
#                 "start_date": "2019-01-01"
#             },
#             "burger_id": 2,
#             "credit": False,
#             "journaalposten": [journaalpost_id]
#         }
#         expected = "Niet ondersteunde combinatie van betaalinstructies."

#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=200, json={'data': [alarm]})
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", status_code=200, json={"data":afspraak})
#         rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/{journaalpost_id}", status_code=200, json={"data": journaalpost})
#         rm4 = rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction_id}", status_code=200, json={"data": banktransactie})


#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarm {
#                             alarmTriggerResult {
#                                 alarm {
#                                     id
#                                 }
#                                 nextAlarmDate
#                                 signaalTriggered
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )


#         # assert
#         assert rm1.called_once
#         assert rm2.called_once
#         assert rm3.called_once
#         assert rm4.called_once
#         assert fallback.called == 0
#         assert response.json.get("errors")[0].get("message") == expected

# @freeze_time("2021-12-06")
# def test_evaluate_alarm_inactive(client):
#     with requests_mock.Mocker() as rm:
#         # arrange
#         alarm = {
#             "id": alarm_id,
#             "isActive":False,
#             "gebruikerEmail":"other@mail.nl",
#             "afspraakId": 19,
#             "datum":"2021-12-06",
#             "datumMargin": 5,
#             "bedrag": "12500",
#             "bedragMargin":"1000"
#         }
#         expected = {'data': {'evaluateAlarm': {'alarmTriggerResult': [{'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'}, 'nextAlarmDate': '2021-12-08', 'signaalTriggered': False}]}}}
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=200, json={'data': [alarm]})
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", status_code=200, json={"data":afspraak})
#         rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/{journaalpost_id}", status_code=200, json={"data": journaalpost})
#         rm4 = rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction_id}", status_code=200, json={"data": banktransactie})
#         rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)


#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarm {
#                             alarmTriggerResult {
#                                 alarm {
#                                     id
#                                 }
#                                 nextAlarmDate
#                                 signaalTriggered
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )


#         # assert
#         assert rm1.called_once
#         assert rm2.called_once
#         assert rm3.called_once
#         assert rm4.called_once
#         assert rm5.called_once
#         assert fallback.called == 0
#         assert response.json == expected

# @freeze_time("2021-12-06")
# def test_evaluate_alarm_no_signal(client):
#     with requests_mock.Mocker() as rm:
#         # arrange
#         expected = {'data': {'evaluateAlarm': {'alarmTriggerResult': [{'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'}, 'nextAlarmDate': '2021-12-08', 'signaalTriggered': False}]}}}
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=200, json={'data': [alarm]})
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", status_code=200, json={"data":afspraak})
#         rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/{journaalpost_id}", status_code=200, json={"data": journaalpost})
#         rm4 = rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction_id}", status_code=200, json={"data": banktransactie})
#         rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)


#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarm {
#                             alarmTriggerResult {
#                                 alarm {
#                                     id
#                                 }
#                                 nextAlarmDate
#                                 signaalTriggered
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )


#         # assert
#         assert rm1.called_once
#         assert rm2.called_once
#         assert rm3.called_once
#         assert rm4.called_once
#         assert rm5.called_once
#         assert fallback.called == 0
#         assert response.json == expected

# @freeze_time("2021-12-06")
# def test_evaluate_alarm_signal_date(client):
#     with requests_mock.Mocker() as rm:
#         # arrange
#         expected = {'data': {'evaluateAlarm': {'alarmTriggerResult': [{'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'}, 'nextAlarmDate': '2021-12-08', 'signaalTriggered': True}]}}}
#         alarm = {
#             "id": alarm_id,
#             "isActive": True,
#             "gebruikerEmail":"other@mail.nl",
#             "afspraakId": 19,
#             "datum":"2021-12-06",
#             "datumMargin": 1,
#             "bedrag": "12500",
#             "bedragMargin":"1000"
#         }
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=200, json={'data': [alarm]})
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", status_code=200, json={"data":afspraak})
#         rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/{journaalpost_id}", status_code=200, json={"data": journaalpost})
#         rm4 = rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction_id}", status_code=200, json={"data": banktransactie})
#         rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)


#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarm {
#                             alarmTriggerResult {
#                                 alarm {
#                                     id
#                                 }
#                                 nextAlarmDate
#                                 signaalTriggered
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )


#         # assert
#         assert rm1.called_once
#         assert rm2.called_once
#         assert rm3.called_once
#         assert rm4.called_once
#         assert rm5.called_once
#         assert fallback.called == 0
#         assert response.json == expected

# @freeze_time("2021-12-06")
# def test_evaluate_alarm_signal_monetary(client):
#     with requests_mock.Mocker() as rm:
#         # arrange
#         expected = {'data': {'evaluateAlarm': {'alarmTriggerResult': [{'alarm': {'id': '00943958-8b93-4617-aa43-669a9016aad9'}, 'nextAlarmDate': '2021-12-08', 'signaalTriggered': True}]}}}
#         banktransactie = {
#             "id": banktransactie_id,
#             "bedrag": 150,
#             "customer_statement_message_id": 15,
#             "information_to_account_owner": "NL83ABNA1927261899               Leefgeld ZOEKTERMPERSONA2 januari 2019",
#             "is_credit": False,
#             "is_geboekt": True,
#             "statement_line": "190101D-1195.20NMSC028",
#             "tegen_rekening": "NL83ABNA1927261899",
#             "transactie_datum": "2021-12-01"
#         }
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         rm1 = rm.get(f"{settings.ALARMENSERVICE_URL}/alarms/", status_code=200, json={'data': [alarm]})
#         rm2 = rm.get(f"{settings.HHB_SERVICES_URL}/afspraken/{afspraak_id}", status_code=200, json={"data":afspraak})
#         rm3 = rm.get(f"{settings.HHB_SERVICES_URL}/journaalposten/{journaalpost_id}", status_code=200, json={"data": journaalpost})
#         rm4 = rm.get(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/{transaction_id}", status_code=200, json={"data": banktransactie})
#         rm5 = rm.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", status_code=201)


#         # act
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": '''
#                     mutation test {
#                         evaluateAlarm {
#                             alarmTriggerResult {
#                                 alarm {
#                                     id
#                                 }
#                                 nextAlarmDate
#                                 signaalTriggered
#                             }
#                         }
#                     }''',
#             },
#             content_type='application/json'
#         )


#         # assert
#         assert rm1.called_once
#         assert rm2.called_once
#         assert rm3.called_once
#         assert rm4.called_once
#         assert rm5.called_once
#         assert fallback.called == 0
#         assert response.json == expected