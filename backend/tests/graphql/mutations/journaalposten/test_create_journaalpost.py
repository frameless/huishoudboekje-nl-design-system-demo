# import re
# import requests
# import requests_mock
# from urllib.parse import unquote

# from hhb_backend.graphql import settings
# from tests.utils.mock_utils import get_by_filter, mock_feature_flag

# alarm1_id = "00943958-8b93-4617-aa43-669a9016aad9"
# alarm2_id = "33738845-7f23-4c8f-8424-2b560a944884"
# alarm3_id = "9b205557-4c6a-468e-94f8-ed4bad90bd3f"
# signaal_id = "e2b282d9-b31f-451e-9242-11f86c902b35"
# mock_afspraken = {
#     11: {"id": 11, "rubriek_id": 1, "credit": True, "burger_id": 1},
#     12: {"id": 12, "rubriek_id": 2, "credit": False, "burger_id": 1},
#     13: {"id": 13, "rubriek_id": 1, "credit": True, "burger_id": 1, "alarm_id": alarm1_id, "journaalposten": [23],
#          "valid_from": "2021-01-01"},
# }
# mock_rubrieken = {
#     "data": [
#         {"id": 1, "naam": "Inkomsten", "grootboekrekening_id": "m1"},
#         {"id": 12, "naam": "Salaris", "grootboekrekening_id": "m12"},
#         {"id": 2, "naam": "Uitgaven", "grootboekrekening_id": "m2"},
#     ]
# }
# mock_grootboekrekeningen = {
#     "m1": {"id": "m1", "naam": "inkomsten", "children": ["m12"], "debet": False},
#     "m12": {"id": "m12", "naam": "salaris", "parent_id": "m1", "debet": False},
#     "m2": {"id": "m2", "naam": "uitgaven", "debet": True}
# }
# mock_bank_transactions = {
#     31: {"id": 31, "is_credit": True, "bedrag": 8000, "transactie_datum": "2021-12-07", "tegen_rekening": "NLTEST1234567801"},
#     32: {"id": 32, "is_credit": False, "bedrag": 8000, "transactie_datum": "2021-12-07", "tegen_rekening": "NLTEST1234567802"},
#     33: {"id": 33, "is_credit": False, "bedrag": 8000, "transactie_datum": "2021-12-07", "tegen_rekening": "NLTEST1234567803"},
#     34: {"id": 34, "is_credit": False, "bedrag": 6000, "transactie_datum": "2021-12-07", "tegen_rekening": "NLTEST1234567804"},
#     35: {"id": 35, "is_credit": False, "bedrag": 6000, "transactie_datum": "2021-12-07", "tegen_rekening": "NLTEST1234567805"},
# }

# mock_rekeningen = {
#     "NLTEST1234567801": {"id": 1, "iban": "NLTEST1234567801"},
#     "NLTEST1234567802": {"id": 2, "iban": "NLTEST1234567802"},
#     "NLTEST1234567803": {"id": 3, "iban": "NLTEST1234567803"},
#     "NLTEST1234567804": {"id": 4, "iban": "NLTEST1234567804"},
# }

# mock_alarmen = {alarm1_id:
#                 {"id": alarm1_id,
#                  "isActive": True,
#                  "afspraakId": 13,
#                  "startDate": "2021-12-07",
#                  "datumMargin": 1,
#                  "bedrag": 8000,
#                  "bedragMargin": 1000,
#                  "byDay": ["Wednesday", "Friday"],
#                  "byMonth": [],
#                  "byMonthDay": []
#                  },
#                 alarm3_id: {"id": alarm3_id,
#                             "is_active": True,
#                             "afspraak_id": 13,
#                             "startDate": "2021-12-07",
#                             "datumMargin": 1,
#                             "bedrag": 8000,
#                             "bedragMargin": 1000,
#                             "byDay": ["Wednesday", "Friday"],
#                             "byMonth": [],
#                             "byMonthDay": []
#                             },
#                 }
# mock_signalen = {
#     "id": "e2b282d9-b31f-451e-9242-11f86c902b35",
#     "alarmId": alarm1_id,
#     "isActive": True,
#     "type": "default",
#     "actions": [],
#     "context": None,
#     "timeCreated": "2021-12-13T13:20:40.784Z"
# }

# journaalposten = []


# def journaalpost_id_counter():
#     global journaalposten
#     return max([jp["id"] for jp in journaalposten], default=22) + 1


# def create_journaalpost_service(request, context):
#     global journaalposten
#     data = request.json()
#     if type(data) == list:
#         for journaalpost in data:
#             journaalpost["id"] = journaalpost_id_counter()
#             journaalposten.append(journaalpost)
#     else:
#         journaalpost = data
#         journaalpost["id"] = journaalpost_id_counter()
#         journaalposten.append(journaalpost)
#     return {"data": data}


# def get_journaalposten(request, _context):
#     global journaalposten
#     ids = unquote(request.url.split("=", 1)[1]).split(",")
#     posten = []
#     if request.url.__contains__("transaction"):
#         for post in journaalposten:
#             if str(post["transaction_id"]) in ids:
#                 posten.append(post)
#     else:
#         for post in journaalposten:
#             print(f"get journaalposten post id: {post}, ids: {ids}")
#             if str(post["id"]) in ids:
#                 posten.append(post)
#     return {"data": posten}


# def get_afspraken(req, _ctx):
#     return get_by_filter(req, mock_afspraken)


# def get_transactions(req: requests.PreparedRequest, _ctx):
#     return get_by_filter(req, mock_bank_transactions)

# def get_rekeningen(req: requests.PreparedRequest, _ctx):
#     return get_by_filter(req, mock_rekeningen)


# def get_grootboekrekeningen(req: requests.PreparedRequest, _ctx):
#     return get_by_filter(req, mock_grootboekrekeningen)


# def get_alarmen(req: requests.PreparedRequest, _ctx):
#     return get_by_filter(req, mock_alarmen)


# def setup_services(mock):
#     global journaalposten
#     journaalposten = []

#     journaalposten.append({"id": 22, "afspraak_id": 12, "transaction_id": 33})

#     bank_transactions_update = mock.put(
#         # requests_mock.ANY,
#         re.compile(f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/.*"),
#         json=echo_json_data,
#     )
#     afspraken_adapter = mock.get(
#         re.compile(f"{settings.HHB_SERVICES_URL}/afspraken/\\?filter_ids=.*"),
#         json=get_afspraken
#     )
#     afspraken_post_adapter = mock.post(
#         re.compile(f"{settings.HHB_SERVICES_URL}/afspraken/13"),
#         json=mock_afspraken[13]
#     )
#     rubrieken_get = mock.get(
#         f"{settings.HHB_SERVICES_URL}/rubrieken/",
#         json=mock_rubrieken,
#     )
#     grootboekrekeningen_adapter = mock.get(
#         re.compile(
#             f"{settings.GROOTBOEK_SERVICE_URL}/grootboekrekeningen/\\?filter_ids=.*"),
#         json=get_grootboekrekeningen,
#     )
#     journaalposten_get_adapter = mock.get(
#         re.compile(
#             f"{settings.HHB_SERVICES_URL}/journaalposten/\\?filter_transactions=.*"),
#         json=get_journaalposten,
#     )
#     joornaalposten_adapter = mock.post(
#         re.compile(f"{settings.HHB_SERVICES_URL}/journaalposten/.*"), json=create_journaalpost_service
#     )
#     journaalposten_get_ids_adapter = mock.get(
#         re.compile(
#             f"{settings.HHB_SERVICES_URL}/journaalposten/\\?filter_ids=.*"),
#         json=get_journaalposten,
#     )
#     bank_transactions_adapter = mock.get(
#         re.compile(
#             f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/\\?filter_ids=.*"),
#         json=get_transactions
#     )
#     rekeningen_adapter = mock.get(
#         re.compile(
#             f"{settings.HHB_SERVICES_URL}/rekeningen/\\?filter_ibans=.*"),
#         json=get_rekeningen
#     )
#     alarmen_get_adapter = mock.get(
#         re.compile(f"{settings.ALARMENSERVICE_URL}/alarms/\\?filter_ids=.*"),
#         json=get_alarmen
#     )
#     active_alarmen_adapter = mock.get(
#         re.compile(
#             f"{settings.ALARMENSERVICE_URL}/alarms/\\?filter_active=true"),
#         json={"data": [mock_alarmen[alarm1_id]]}
#     )
#     alarmen_post_adapter = mock.post(
#         re.compile(f"{settings.ALARMENSERVICE_URL}/alarms/"),
#         json={"data": mock_alarmen[alarm3_id]}, status_code=201
#     )
#     alarmen_update_adapter = mock.put(
#         re.compile(f"{settings.ALARMENSERVICE_URL}/alarms/{alarm1_id}"),
#         json={"data": mock_alarmen[alarm1_id]}
#     )
#     signalen_adapter = mock.post(
#         re.compile(f"{settings.SIGNALENSERVICE_URL}/signals/"),
#         json={"data": mock_signalen}, status_code=201
#     )

#     mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/",
#               json={"data": {"id": 1}})

#     return {
#         "afspraken": afspraken_adapter,
#         "afspraken_post": afspraken_post_adapter,
#         "transacties": bank_transactions_adapter,
#         "rekeningen": rekeningen_adapter,
#         "transacties_update": bank_transactions_update,
#         "grootboekrekeningen": grootboekrekeningen_adapter,
#         "rubrieken": rubrieken_get,
#         "journaalposten": joornaalposten_adapter,
#         "journaalposten_get": journaalposten_get_adapter,
#         "journaalposten_get_ids": journaalposten_get_ids_adapter,
#         "alarmen_get": alarmen_get_adapter,
#         "active_alarmen_get": active_alarmen_adapter,
#         "alarmen_post": alarmen_post_adapter,
#         "alarmen_update": alarmen_update_adapter,
#         "signalen_post": signalen_adapter
#     }


# def echo_json_data(req, ctx):
#     return {"data": req.json()}


# def test_create_journaalpost_grootboekrekening(client):
#     with requests_mock.Mocker() as mock:
#         adapters = setup_services(mock)

#         response = client.post(
#             "/graphql",
#             json={
#                 "query": """
#                     mutation test($input:CreateJournaalpostGrootboekrekeningInput!) {
#                     createJournaalpostGrootboekrekening(input:$input) {
#                         ok
#                         journaalpost {
#                         id
#                         grootboekrekening { id }
#                         transaction { id }
#                         afspraak { id }
#                         isAutomatischGeboekt
#                         }
#                     }
#                 }""",
#                 "variables": {
#                     "input": {"transactionId": 31, "grootboekrekeningId": "m12", "isAutomatischGeboekt": False}
#                 },
#             },
#             content_type="application/json",
#         )
#         assert response.json == {
#             "data": {
#                 "createJournaalpostGrootboekrekening": {
#                     "ok": True,
#                     "journaalpost": {
#                         "id": 23,
#                         "grootboekrekening": {"id": "m12"},
#                         "transaction": {"id": 31},
#                         "afspraak": None,
#                         "isAutomatischGeboekt": False
#                     },
#                 }
#             }
#         }

#         assert adapters["afspraken"].call_count == 0
#         assert adapters["afspraken_post"].call_count == 0
#         assert adapters["transacties"].call_count == 2
#         assert adapters["rekeningen"].call_count == 0
#         assert adapters["transacties_update"].call_count == 1
#         assert adapters["grootboekrekeningen"].call_count == 2
#         assert adapters["rubrieken"].call_count == 0
#         assert adapters["journaalposten"].call_count == 1
#         assert adapters["journaalposten_get"].call_count == 1
#         assert adapters["journaalposten_get_ids"].call_count == 0
#         assert adapters["alarmen_get"].call_count == 0
#         assert adapters["active_alarmen_get"].call_count == 0
#         assert adapters["alarmen_post"].call_count == 0
#         assert adapters["alarmen_update"].call_count == 0
#         assert adapters["signalen_post"].call_count == 0


# def test_create_journaalpost_grootboekrekening_unknown_transaction(client):
#     with requests_mock.Mocker() as mock:
#         adapters = setup_services(mock)

#         response = client.post(
#             "/graphql",
#             json={
#                 "query": """
#                     mutation test($input:CreateJournaalpostGrootboekrekeningInput!) {
#                     createJournaalpostGrootboekrekening(input:$input) {
#                         ok
#                         journaalpost {
#                         id
#                         grootboekrekening { id }
#                         transaction { id }
#                         afspraak { id }
#                         isAutomatischGeboekt
#                         }
#                     }
#                 }""",
#                 "variables": {
#                     "input": {"transactionId": 7777, "grootboekrekeningId": "m12", "isAutomatischGeboekt": False}
#                 },
#             },
#             content_type="application/json",
#         )

#         assert adapters["afspraken"].call_count == 0
#         assert adapters["afspraken_post"].call_count == 0
#         assert adapters["transacties"].call_count == 1
#         assert adapters["rekeningen"].call_count == 0
#         assert adapters["transacties_update"].call_count == 0
#         assert adapters["grootboekrekeningen"].call_count == 0
#         assert adapters["rubrieken"].call_count == 0
#         assert adapters["journaalposten"].call_count == 0
#         assert adapters["journaalposten_get"].call_count == 0
#         assert adapters["journaalposten_get_ids"].call_count == 0
#         assert adapters["alarmen_get"].call_count == 0
#         assert adapters["active_alarmen_get"].call_count == 0
#         assert adapters["alarmen_post"].call_count == 0
#         assert adapters["alarmen_update"].call_count == 0
#         assert adapters["signalen_post"].call_count == 0

#         assert response.json["errors"][0]["message"] == "transaction not found"


# def test_create_journaalpost_grootboekrekening_duplicate_not_allowed(client):
#     with requests_mock.Mocker() as mock:
#         adapters = setup_services(mock)

#         global journaalposten
#         journaalposten.append({
#             "id": 23,
#             "transaction_id": 31,
#             "grootboekrekening_id": "m12",
#         })
#         create_journaalpost_mutation = """
#             mutation test($input:CreateJournaalpostGrootboekrekeningInput!) {
#               createJournaalpostGrootboekrekening(input:$input) {
#                 ok
#                 journaalpost {
#                   id
#                   grootboekrekening { id }
#                   transaction { id }
#                   afspraak { id }
#                   isAutomatischGeboekt
#                 }
#               }
#             }"""
#         response = client.post(
#             "/graphql",
#             json={
#                 "query": create_journaalpost_mutation,
#                 "variables": {
#                     "input": {"transactionId": 31, "grootboekrekeningId": "m12", "isAutomatischGeboekt": False}
#                 },
#             },
#             content_type="application/json",
#         )

#         assert adapters["afspraken"].call_count == 0
#         assert adapters["afspraken_post"].call_count == 0
#         assert adapters["transacties"].call_count == 1
#         assert adapters["rekeningen"].call_count == 0
#         assert adapters["transacties_update"].call_count == 0
#         assert adapters["grootboekrekeningen"].call_count == 1
#         assert adapters["rubrieken"].call_count == 0
#         assert adapters["journaalposten"].call_count == 0
#         assert adapters["journaalposten_get"].call_count == 1
#         assert adapters["journaalposten_get_ids"].call_count == 0
#         assert adapters["alarmen_get"].call_count == 0
#         assert adapters["active_alarmen_get"].call_count == 0
#         assert adapters["alarmen_post"].call_count == 0
#         assert adapters["alarmen_update"].call_count == 0
#         assert adapters["signalen_post"].call_count == 0

#         assert response.json == {
#             "data": {"createJournaalpostGrootboekrekening": None},
#             "errors": [
#                 {
#                     "locations": [{"column": 15, "line": 3}],
#                     "message": "Journaalpost already exists for Transaction",
#                     "path": ["createJournaalpostGrootboekrekening"],
#                 }
#             ],
#         }


# def test_create_journaalpost_afspraak(client, mocker):
#     with requests_mock.Mocker() as mock:
#         adapters = setup_services(mock)

#         mocker.patch("hhb_backend.feature_flags.Unleash.is_enabled",
#                      mock_feature_flag("signalen", True))

#         response = client.post(
#             "/graphql",
#             json={
#                 "query": """
#                     mutation test($input:[CreateJournaalpostAfspraakInput!]!) {
#                     createJournaalpostAfspraak(input:$input) {
#                         ok
#                         journaalposten {
#                         id
#                         afspraak { id }
#                         transaction { id }
#                         isAutomatischGeboekt
#                         }
#                     }
#                 }""",
#                 "variables": {"input": [{"transactionId": 31, "afspraakId": 11, "isAutomatischGeboekt": False}, ]},
#             },
#             content_type="application/json",
#         )

#         assert adapters["afspraken"].call_count == 2
#         assert adapters["afspraken_post"].call_count == 0
#         assert adapters["transacties"].call_count == 2
#         assert adapters["rekeningen"].call_count == 1
#         assert adapters["transacties_update"].call_count == 1
#         assert adapters["grootboekrekeningen"].call_count == 0
#         assert adapters["rubrieken"].call_count == 1
#         assert adapters["journaalposten"].call_count == 1
#         assert adapters["journaalposten_get"].call_count == 2
#         assert adapters["journaalposten_get_ids"].call_count == 0
#         assert adapters["alarmen_get"].call_count == 0
#         assert adapters["active_alarmen_get"].call_count == 0
#         assert adapters["alarmen_post"].call_count == 0
#         assert adapters["alarmen_update"].call_count == 0
#         assert adapters["signalen_post"].call_count == 0

#         assert response.json == {
#             "data": {
#                 "createJournaalpostAfspraak": {
#                     "ok": True,
#                     "journaalposten": [{
#                         "id": 23,
#                         "afspraak": {"id": 11},
#                         "transaction": {"id": 31},
#                         "isAutomatischGeboekt": False
#                     }, ]
#                 }
#             }
#         }


# def test_create_journaalpost_afspraak_journaalpost_exists(client):
#     with requests_mock.Mocker() as mock:
#         adapters = setup_services(mock)

#         response = client.post(
#             "/graphql",
#             json={
#                 "query": """
#                     mutation test($input:[CreateJournaalpostAfspraakInput!]!) {
#                         createJournaalpostAfspraak(input:$input) {
#                             ok
#                             journaalposten {
#                             id
#                             afspraak { id }
#                             transaction { id }
#                             isAutomatischGeboekt
#                             }
#                         }
#                     }""",
#                 "variables": {"input": [{"transactionId": 33, "afspraakId": 12, "isAutomatischGeboekt": False}, ]},
#             },
#             content_type="application/json",
#         )

#         assert adapters["afspraken"].call_count == 0
#         assert adapters["afspraken_post"].call_count == 0
#         assert adapters["transacties"].call_count == 1
#         assert adapters["rekeningen"].call_count == 1
#         assert adapters["transacties_update"].call_count == 0
#         assert adapters["grootboekrekeningen"].call_count == 0
#         assert adapters["rubrieken"].call_count == 0
#         assert adapters["journaalposten"].call_count == 0
#         assert adapters["journaalposten_get"].call_count == 1
#         assert adapters["journaalposten_get_ids"].call_count == 0
#         assert adapters["alarmen_get"].call_count == 0
#         assert adapters["active_alarmen_get"].call_count == 0
#         assert adapters["alarmen_post"].call_count == 0
#         assert adapters["alarmen_update"].call_count == 0
#         assert adapters["signalen_post"].call_count == 0

#         assert response.json == {
#             "data": {"createJournaalpostAfspraak": None},
#             "errors": [
#                 {
#                     "locations": [{"column": 25, "line": 3}],
#                     "message": "(some) journaalposten already exist",
#                     "path": ["createJournaalpostAfspraak"],
#                 }
#             ],
#         }

# def test_create_journaalpost_afspraak_unknown_iban_transaction(client):
#     with requests_mock.Mocker() as mock:
#         adapters = setup_services(mock)

#         response = client.post(
#             "/graphql",
#             json={
#                 "query": """
#                     mutation test($input:[CreateJournaalpostAfspraakInput!]!) {
#                         createJournaalpostAfspraak(input:$input) {
#                             ok
#                             journaalposten {
#                             id
#                             afspraak { id }
#                             transaction { id }
#                             isAutomatischGeboekt
#                             }
#                         }
#                     }""",
#                 "variables": {"input": [{"transactionId": 35, "afspraakId": 12, "isAutomatischGeboekt": False}, ]},
#             },
#             content_type="application/json",
#         )

#         assert adapters["afspraken"].call_count == 0
#         assert adapters["afspraken_post"].call_count == 0
#         assert adapters["transacties"].call_count == 1
#         assert adapters["rekeningen"].call_count == 1
#         assert adapters["transacties_update"].call_count == 0
#         assert adapters["grootboekrekeningen"].call_count == 0
#         assert adapters["rubrieken"].call_count == 0
#         assert adapters["journaalposten"].call_count == 0
#         assert adapters["journaalposten_get"].call_count == 0
#         assert adapters["journaalposten_get_ids"].call_count == 0
#         assert adapters["alarmen_get"].call_count == 0
#         assert adapters["active_alarmen_get"].call_count == 0
#         assert adapters["alarmen_post"].call_count == 0
#         assert adapters["alarmen_update"].call_count == 0
#         assert adapters["signalen_post"].call_count == 0

#         assert response.json == {
#             "data": {"createJournaalpostAfspraak": None},
#             "errors": [
#                 {
#                     "locations": [{"column": 25, "line": 3}],
#                     "message": "(some) transactions have unknown ibans ['NLTEST1234567805']",
#                     "path": ["createJournaalpostAfspraak"],
#                 }
#             ],
#         }

# def test_create_journaalpost_per_afspraak(client, mocker):
#     with requests_mock.Mocker() as mock:
#         adapters = setup_services(mock)
#         mocker.patch("hhb_backend.feature_flags.Unleash.is_enabled",
#                      mock_feature_flag("signalen", True))

#         response = client.post(
#             "/graphql",
#             json={
#                 "query": """
#                     mutation test($input: [CreateJournaalpostAfspraakInput!]!) {
#                         createJournaalpostAfspraak(input: $input) {
#                             ok
#                             journaalposten {
#                             id
#                             afspraak {
#                                 id
#                             }
#                             transaction {
#                                 id
#                             }
#                             isAutomatischGeboekt
#                             }
#                         }
#                     }""",
#                 "variables": {"input": [
#                     {"transactionId": 31, "afspraakId": 11,
#                         "isAutomatischGeboekt": True},
#                     {"transactionId": 32, "afspraakId": 12,
#                         "isAutomatischGeboekt": True},
#                 ]},
#             },
#         )

#         assert adapters["afspraken"].call_count == 3
#         assert adapters["afspraken_post"].call_count == 0
#         assert adapters["transacties"].call_count == 3
#         assert adapters["rekeningen"].call_count == 1
#         assert adapters["transacties_update"].call_count == 1
#         assert adapters["grootboekrekeningen"].call_count == 0
#         assert adapters["rubrieken"].call_count == 1
#         assert adapters["journaalposten"].call_count == 1
#         assert adapters["journaalposten_get"].call_count == 2
#         assert adapters["journaalposten_get_ids"].call_count == 0
#         assert adapters["alarmen_get"].call_count == 0
#         assert adapters["active_alarmen_get"].call_count == 0
#         assert adapters["alarmen_post"].call_count == 0
#         assert adapters["alarmen_update"].call_count == 0
#         assert adapters["signalen_post"].call_count == 0

#         assert response.json == {
#             "data": {
#                 "createJournaalpostAfspraak": {
#                     "ok": True,
#                     "journaalposten": [
#                         {
#                             "id": 23,
#                             "afspraak": {"id": 11},
#                             "transaction": {"id": 31},
#                             "isAutomatischGeboekt": True
#                         }, {
#                             "id": 24,
#                             "afspraak": {"id": 12},
#                             "transaction": {"id": 32},
#                             "isAutomatischGeboekt": True
#                         },
#                     ],
#                 }
#             }
#         }


# def test_create_journaalpost_automatically_evaluate_alarms_no_signal_created(client, mocker):
#     """Tests create journaalpost and if it automatically evaluates the alarms of the afspraken in the journaalposten, next alarm created, no signaal created."""
#     with requests_mock.Mocker() as mock:
#         adapters = setup_services(mock)
#         mocker.patch("hhb_backend.feature_flags.Unleash.is_enabled",
#                      mock_feature_flag("signalen", True))

#         response = client.post(
#             "/graphql",
#             json={
#                 "query": """
#                     mutation test($input:[CreateJournaalpostAfspraakInput!]!) {
#                     createJournaalpostAfspraak(input:$input) {
#                         ok
#                         journaalposten {
#                         id
#                         afspraak { id }
#                         transaction { id }
#                         isAutomatischGeboekt
#                         }
#                     }
#                 }""",
#                 "variables": {"input": [{"transactionId": 31, "afspraakId": 13, "isAutomatischGeboekt": True}, ]},
#             },
#             content_type="application/json",
#         )

#         assert adapters["afspraken"].call_count == 3
#         assert adapters["afspraken_post"].call_count == 1
#         assert adapters["transacties"].call_count == 3
#         assert adapters["rekeningen"].call_count == 1
#         assert adapters["transacties_update"].call_count == 1
#         assert adapters["grootboekrekeningen"].call_count == 0
#         assert adapters["rubrieken"].call_count == 1
#         assert adapters["journaalposten"].call_count == 1
#         assert adapters["journaalposten_get"].call_count == 2
#         assert adapters["journaalposten_get_ids"].call_count == 0
#         assert adapters["alarmen_get"].call_count == 1
#         assert adapters["active_alarmen_get"].call_count == 1
#         assert adapters["alarmen_post"].call_count == 1
#         assert adapters["alarmen_update"].call_count == 1
#         assert adapters["signalen_post"].call_count == 0

#         assert response.json == {
#             "data": {
#                 "createJournaalpostAfspraak": {
#                     "ok": True,
#                     "journaalposten": [{
#                         "id": 23,
#                         "afspraak": {"id": 13},
#                         "transaction": {"id": 31},
#                         "isAutomatischGeboekt": True
#                     }, ]
#                 }
#             }
#         }


# def test_create_journaalpost_automatically_evaluate_alarms_signal_created(client, mocker):
#     """Tests if create journaalposten automatally evaluates alarms, next alarm created, signal created."""
#     with requests_mock.Mocker() as mock:
#         adapters = setup_services(mock)
#         mocker.patch("hhb_backend.feature_flags.Unleash.is_enabled",
#                      mock_feature_flag("signalen", True))

#         response = client.post(
#             "/graphql",
#             json={
#                 "query": """
#                     mutation test($input:[CreateJournaalpostAfspraakInput!]!) {
#                     createJournaalpostAfspraak(input:$input) {
#                         ok
#                         journaalposten {
#                         id
#                         afspraak { id }
#                         transaction { id }
#                         isAutomatischGeboekt
#                         }
#                     }
#                 }""",
#                 "variables": {"input": [{"transactionId": 34, "afspraakId": 13, "isAutomatischGeboekt": True}, ]},
#             },
#             content_type="application/json",
#         )

#         assert adapters["afspraken"].call_count == 3
#         assert adapters["afspraken_post"].call_count == 1
#         assert adapters["transacties"].call_count == 3
#         assert adapters["rekeningen"].call_count == 1
#         assert adapters["transacties_update"].call_count == 1
#         assert adapters["grootboekrekeningen"].call_count == 0
#         assert adapters["rubrieken"].call_count == 1
#         assert adapters["journaalposten"].call_count == 1
#         assert adapters["journaalposten_get"].call_count == 2
#         assert adapters["journaalposten_get_ids"].call_count == 0
#         assert adapters["alarmen_get"].call_count == 1
#         assert adapters["active_alarmen_get"].call_count == 1
#         assert adapters["alarmen_post"].call_count == 1
#         assert adapters["alarmen_update"].call_count == 2
#         assert adapters["signalen_post"].call_count == 1

#         assert response.json == {
#             "data": {
#                 "createJournaalpostAfspraak": {
#                     "ok": True,
#                     "journaalposten": [{
#                         "id": 23,
#                         "afspraak": {"id": 13},
#                         "transaction": {"id": 34},
#                         "isAutomatischGeboekt": True
#                     }, ]
#                 }
#             }
#         }
