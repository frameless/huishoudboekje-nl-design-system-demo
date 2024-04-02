# from mock import patch
# import requests_mock
# from hhb_backend.processen import brieven_export
# from datetime import datetime
# from hhb_backend.graphql import settings

# class MockResponse():
#     history = None
#     raw = None
#     is_redirect = None
#     content = None

#     def __init__(self, json_data, status_code, ok=True):
#         self.json_data = json_data
#         self.status_code = status_code
#         self.ok = ok

#     def json(self):
#         return self.json_data

#     def ok(self):
#         return self.ok
    
# @patch('hhb_backend.audit_logging.AuditLogging.create')
# def test_create_export_brieven(client):
#     with requests_mock.Mocker() as mock:
#         # arrange
#         burger_id = 2
#         fallback = mock.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)

#         afspraken = {'data': [{'aantal_betalingen': None, 'afdeling_id': 12, 'bedrag': 1234, 'betaalinstructie': None, 'burger_id': 2, 'credit': True, 'id': 12, 'journaalposten': [], 'omschrijving': 'export test afspraak', 'overschrijvingen': [], 'postadres_id': 'ce2e9ac9-9759-48c5-85fa-7dacc9913e37', 'rubriek_id': 2, 'tegen_rekening_id': 1, 'valid_from': '2000-01-31', 'valid_through': '2021-12-01T00:00:00', 'zoektermen': ['stuff, things, test#1, com bi na ti']}]}
#         afspraak_endpoint = mock.get(f"{settings.HHB_SERVICES_URL}/afspraken/?filter_burgers={burger_id}", json=afspraken)

#         postadres_ids_1 = 'ce2e9ac9-9759-48c5-85fa-7dacc9913e37'
#         afspraak_postadres = {'data': [
#             {'id': '378d8f82-ffac-42e0-af82-7041014389a4', 'street': 'test straat 2', 'houseNumber': 'test huisnummer 2', 'postalCode': 'test postcode 2', 'locality': 'test plaats 2', 'timeCreated': '2021-10-25T08:15:54+00:00'},
#             {'id': 'ce2e9ac9-9759-48c5-85fa-7dacc9913e37', 'street': 'test straat 1.1', 'houseNumber': 'test huisnummer 1.1', 'postalCode': 'code 1.1', 'locality': 'test plaats 1.1', 'timeCreated': '2021-10-25T08:11:29+00:00'}]}
#         postadres_endpoint_1 = mock.get(f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/?filter_ids={postadres_ids_1}", json=afspraak_postadres)

#         afdeling_id = 12
#         afdelingen = {'data': [{'id': 12, 'naam': 'test afdeling', 'organisatie_id': 6, 'postadressen_ids': ['ce2e9ac9-9759-48c5-85fa-7dacc9913e37', '378d8f82-ffac-42e0-af82-7041014389a4']}]}
#         afdeling_endpoint = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/afdelingen/?filter_ids={afdeling_id}", json=afdelingen)

#         postadres_ids_2 = 'ce2e9ac9-9759-48c5-85fa-7dacc9913e37,378d8f82-ffac-42e0-af82-7041014389a4'
#         afdeling_postadres = {'data': [
#             {'id': '378d8f82-ffac-42e0-af82-7041014389a4', 'street': 'test straat 2', 'houseNumber': 'test huisnummer 2', 'postalCode': 'test postcode 2', 'locality': 'test plaats 2', 'timeCreated': '2021-10-25T08:15:54+00:00'},
#             {'id': 'ce2e9ac9-9759-48c5-85fa-7dacc9913e37', 'street': 'test straat 1.1', 'houseNumber': 'test huisnummer 1.1', 'postalCode': 'code 1.1', 'locality': 'test plaats 1.1', 'timeCreated': '2021-10-25T08:11:29+00:00'}]}
#         postadres_endpoint_2 = mock.get(f"{settings.POSTADRESSEN_SERVICE_URL}/addresses/?filter_ids={postadres_ids_2}", json=afdeling_postadres)

#         organisatie_id = 6
#         organisaties = {'data': [{'id': 6, 'kvknummer': '12345678', 'naam': 'test organisatie 1', 'vestigingsnummer': '1234'}]}
#         organisatie_endpoint = mock.get(f"{settings.ORGANISATIE_SERVICES_URL}/organisaties/?filter_ids={organisatie_id}", json=organisaties)

#         # act
#         response_csv, filename_csv, data_excel, filename_excel = brieven_export.create_brieven_export(burger_id)
#         current_date_str = datetime.now().strftime("%-d-%-m-%Y")

#         # act
#         response_csv, filename_csv, data_excel, filename_excel = brieven_export.create_brieven_export(burger_id)
#         current_date_str = datetime.now().strftime("%-d-%-m-%Y")

#         # assert
#         assert burger_endpoint.call_count == 1
#         assert afspraak_endpoint.call_count == 1
#         assert afdeling_endpoint.call_count == 1
#         assert postadres_endpoint_1.call_count == 1
#         assert postadres_endpoint_2.call_count == 1
#         assert organisatie_endpoint.call_count == 1

#         assert response_csv == f'betaalrichting|status.afspraak|organisatie.naam|organisatie.postadres.adresregel1|organisatie.postadres.postcode|organisatie.postadres.plaats|afspraak.id|afspraak.omschrijving|nu.datum|burger.hhbnummer|burger.voorletters|burger.voornamen|burger.achternaam|burger.postadres.adresregel1|burger.postadres.postcode|burger.postadres.plaats\ncredit|1-12-2021|test organisatie 1|test straat 1.1 test huisnummer 1.1|code 1.1|test plaats 1.1|stuff, things, test#1, com bi na ti|export test afspraak|{current_date_str}|HHB000002|J|John|Do|burger test straat 15a|1234AB|burger test plaats\n'
#         assert filename_csv == f"{current_date_str}_{burger['data'][0]['voornamen']}_{burger['data'][0]['achternaam']}.csv"
#         assert filename_excel == f"{current_date_str}_{burger['data'][0]['voornamen']}_{burger['data'][0]['achternaam']}.xlsx"
#         assert fallback.call_count == 0


