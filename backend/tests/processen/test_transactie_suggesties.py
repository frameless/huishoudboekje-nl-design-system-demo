import pytest
import requests_mock

from hhb_backend.graphql import settings
from hhb_backend.processen.automatisch_boeken import transactie_suggesties


def post_echo(request, _context):
    return {"data": (request.json())}


@pytest.mark.asyncio
async def test_transactie_suggesties_matches(test_request_context):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json=post_echo)

        get_transactions = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids=7,8,9", json={'data': [
                {'bedrag': None, 'customer_statement_message_id': 17, 'id': 7,
                 'information_to_account_owner': '/EREF/15814016000676480//CNTP/NL32INGB0000012345/INGBNL2A/J.Janssen///REMI/STRD/CUR/9001123412341234/',
                 'is_credit': None, 'is_geboekt': None, 'statement_line': '140220C32.00NTRF900112341234123408/',
                 'tegen_rekening': 'NL04RABO5082680188', "transactie_datum": '2020-10-10'},
                {'bedrag': None, 'customer_statement_message_id': 17, 'id': 8,
                 'information_to_account_owner': '/EREF/15614016000384600//CNTP/NL32INGB0000012345/INGBNL2A/INGBANK NV///REMI/STRD/CUR/1070123412341234/\n/SUM/4/4/134,46/36,58/\n\xad}',
                 'is_credit': None, 'is_geboekt': None, 'statement_line': '140220D-119.00NTRF107012341234123408/',
                 'tegen_rekening': 'NL29ABNA5179205913', "transactie_datum": '2020-10-10'},
                {'bedrag': None, 'customer_statement_message_id': 17, 'id': 9,
                 'information_to_account_owner': '/EREF/15614016000323121//CNTP/NL32INGB0000012345/INGBNL2A/INGBANK NV///REMI/STRD/CUR/1070123412341234/\n/SUM/4/4/134,46/36,58/\n\xad}',
                 'is_credit': None, 'is_geboekt': None, 'statement_line': '140220D-119.00NTRF107012341234123408/',
                 'tegen_rekening': 'NL29ABNA5179215999', "transactie_datum": '2021-12-31'}
            ]})

        get_rekeningen = mock.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ibans=NL04RABO5082680188,NL29ABNA5179205913,NL29ABNA5179215999", json={
                'data': [{'afspraken': [4], 'gebruikers': [], 'iban': 'NL04RABO5082680188', 'id': 2, 'organisaties': [],
                          'rekeninghouder': 'Hema'},
                         {'afspraken': [3], 'gebruikers': [], 'iban': 'NL29ABNA5179205913', 'id': 3, 'organisaties': [],
                          'rekeninghouder': 'Shell'},
                         {'afspraken': [5], 'gebruikers': [], 'iban': 'NL29ABNA5179215999', 'id': 5, 'organisaties': [],
                          'rekeninghouder': 'Shell'}
                         ]})

        get_afspraken = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_rekening=2,3,5", json={
                'data': [{'aantal_betalingen': 12,
                          'automatische_incasso': False, 'bedrag': 450000, 'omschrijving': 'Nog meer geld overmaken',
                          'credit': True, 'valid_through': '2021-12-31', 'gebruiker_id': 1, 'id': 4,
                          'interval': 'P0Y1M0W0D', 'journaalposten': [], 'zoektermen': ['15814016000676480'],
                          'organisatie_id': None,
                          'overschrijvingen': [52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63], 'rubriek_id': None,
                          'valid_from': '2021-01-01', 'tegen_rekening_id': 2},
                         {'aantal_betalingen': 12,
                          'automatische_incasso': False, 'bedrag': 4654654, 'omschrijving': 'Money', 'credit': True,
                          'valid_through': '2021-12-31', 'gebruiker_id': 1, 'id': 3, 'interval': 'P0Y1M0W0D',
                          'journaalposten': [], 'zoektermen': ['1070123412341234'], 'organisatie_id': None,
                          'overschrijvingen': [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51], 'rubriek_id': None,
                          'valid_from': '2021-01-01', 'tegen_rekening_id': 3},
                         {'aantal_betalingen': 12,
                          'automatische_incasso': False, 'bedrag': 4654654, 'omschrijving': 'Money', 'credit': True,
                          'valid_through': '2021-12-31', 'gebruiker_id': 1, 'id': 5, 'interval': 'P0Y1M0W0D',
                          'journaalposten': [], 'zoektermen': ['15614016000323121'], 'organisatie_id': None,
                          'overschrijvingen': [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51], 'rubriek_id': None,
                          'valid_from': '2021-01-01', 'tegen_rekening_id': 5}
                         ]})

        result = await transactie_suggesties([7, 8, 9])

        assert get_transactions.called_once
        assert get_rekeningen.called_once
        assert get_afspraken.called_once
        assert result[7][0]["id"] == 4
        assert len(result[7]) == 1
        assert result[8][0]["id"] == 3
        assert len(result[8]) == 1
        # Transaction date is on valid_through date
        assert len(result[9]) == 0

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


@pytest.mark.asyncio
async def test_transactie_suggesties_multiple_matches(test_request_context):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json=post_echo)

        get_transactions = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids=7,8", json={'data': [
                {'bedrag': None, 'customer_statement_message_id': 17, 'id': 7,
                 'information_to_account_owner': '/EREF/15814016000676480//CNTP/NL32INGB0000012345/INGBNL2A/J.Janssen///REMI/STRD/CUR/9001123412341234/',
                 'is_credit': None, 'is_geboekt': None, 'statement_line': '140220C32.00NTRF900112341234123408/',
                 'tegen_rekening': 'NL04RABO5082680188', "transactie_datum": '2021-12-30'},
                {'bedrag': None, 'customer_statement_message_id': 17, 'id': 8,
                 'information_to_account_owner': '/EREF/15614016000384600//CNTP/NL32INGB0000012345/INGBNL2A/INGBANK NV///REMI/STRD/CUR/1070123412341234/\n/SUM/4/4/134,46/36,58/\n\xad}',
                 'is_credit': None, 'is_geboekt': None, 'statement_line': '140220D-119.00NTRF107012341234123408/',
                 'tegen_rekening': 'NL29ABNA5179205913', "transactie_datum": '2021-12-30'}]})

        get_rekeningen = mock.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ibans=NL04RABO5082680188,NL29ABNA5179205913", json={
                'data': [{'afspraken': [4], 'gebruikers': [], 'iban': 'NL04RABO5082680188', 'id': 2, 'organisaties': [],
                          'rekeninghouder': 'Hema'},
                         {'afspraken': [3], 'gebruikers': [], 'iban': 'NL29ABNA5179205913', 'id': 3, 'organisaties': [],
                          'rekeninghouder': 'Shell'}]})

        get_afspraken = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_rekening=2,3", json={
                'data': [{'aantal_betalingen': 12,
                          'automatische_incasso': False, 'bedrag': 450000, 'omschrijving': 'Nog meer geld overmaken',
                          'credit': True, 'valid_through': '2021-12-31', 'gebruiker_id': 1, 'id': 4,
                          'interval': 'P0Y1M0W0D', 'journaalposten': [], 'zoektermen': ['15814016000676480'],
                          'organisatie_id': None,
                          'overschrijvingen': [52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63], 'rubriek_id': None,
                          'valid_from': '2021-01-01', 'tegen_rekening_id': 2},
                         {'aantal_betalingen': 12,
                          'automatische_incasso': False, 'bedrag': 4654654, 'omschrijving': 'Zorg', 'credit': True,
                          'valid_through': '2021-12-31', 'gebruiker_id': 1, 'id': 3, 'interval': 'P0Y1M0W0D',
                          'journaalposten': [], 'zoektermen': ['1070123412341234'], 'organisatie_id': None,
                          'overschrijvingen': [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51], 'rubriek_id': None,
                          'valid_from': '2021-01-01', 'tegen_rekening_id': 3},
                         {'aantal_betalingen': 12,
                          'automatische_incasso': False, 'bedrag': 54646, 'omschrijving': 'Zorg 2', 'credit': True,
                          'valid_through': '2021-12-31', 'gebruiker_id': 1, 'id': 5, 'interval': 'P0Y1M0W0D',
                          'journaalposten': [], 'zoektermen': ['12341234'], 'organisatie_id': None,
                          'overschrijvingen': [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51], 'rubriek_id': None,
                          'valid_from': '2021-01-01', 'tegen_rekening_id': 3}
                         ]})

        result = await transactie_suggesties([7, 8])

        assert get_transactions.called_once
        assert get_rekeningen.called_once
        assert get_afspraken.called_once
        assert result[7][0]["id"] == 4
        assert len(result[7]) == 1
        assert result[8][0]["id"] == 3
        assert result[8][1]["id"] == 5
        assert len(result[8]) == 2

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


@pytest.mark.asyncio
async def test_transactie_suggesties_no_matches(test_request_context):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json=post_echo)

        get_transactions = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids=7,8", json={'data': [
                {'bedrag': None, 'customer_statement_message_id': 17, 'id': 7,
                 'information_to_account_owner': '/EREF/15814016000676480//CNTP/NL32INGB0000012345/INGBNL2A/J.Janssen///REMI/STRD/CUR/9001123412341234/',
                 'is_credit': None, 'is_geboekt': None, 'statement_line': '140220C32.00NTRF900112341234123408/',
                 'tegen_rekening': 'NL04RABO5082680188', 'transactie_datum': None},
                {'bedrag': None, 'customer_statement_message_id': 17, 'id': 8,
                 'information_to_account_owner': '/EREF/15614016000384600//CNTP/NL32INGB0000012345/INGBNL2A/INGBANK NV///REMI/STRD/CUR/1070123412341234/\n/SUM/4/4/134,46/36,58/\n\xad}',
                 'is_credit': None, 'is_geboekt': None, 'statement_line': '140220D-119.00NTRF107012341234123408/',
                 'tegen_rekening': 'NL29ABNA5179205913', 'transactie_datum': None}]})

        get_rekeningen = mock.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ibans=NL04RABO5082680188,NL29ABNA5179205913", json={
                'data': [{'afspraken': [4], 'gebruikers': [], 'iban': 'NL04RABO5082680188', 'id': 2, 'organisaties': [],
                          'rekeninghouder': 'Hema'},
                         {'afspraken': [3], 'gebruikers': [], 'iban': 'NL29ABNA5179205913', 'id': 3, 'organisaties': [],
                          'rekeninghouder': 'Shell'}]})

        get_afspraken = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_rekening=2,3", json={
                'data': [{'aantal_betalingen': 12,
                          'automatische_incasso': False, 'bedrag': 450000, 'omschrijving': 'Nog meer geld overmaken',
                          'credit': True, 'valid_through': '2021-12-31', 'gebruiker_id': 1, 'id': 4,
                          'interval': 'P0Y1M0W0D', 'journaalposten': [], 'zoektermen': None, 'organisatie_id': None,
                          'overschrijvingen': [52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63], 'rubriek_id': None,
                          'valid_from': '2021-01-01', 'tegen_rekening_id': 2},
                         {'aantal_betalingen': 12,
                          'automatische_incasso': False, 'bedrag': 4654654, 'omschrijving': 'Money', 'credit': True,
                          'valid_through': '2021-12-31', 'gebruiker_id': 1, 'id': 3, 'interval': 'P0Y1M0W0D',
                          'journaalposten': [], 'zoektermen': None, 'organisatie_id': None,
                          'overschrijvingen': [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51], 'rubriek_id': None,
                          'valid_from': '2021-01-01', 'tegen_rekening_id': 3}]})

        result = await transactie_suggesties([7, 8])

        assert get_transactions.called_once
        assert get_rekeningen.called_once
        assert get_afspraken.called_once
        assert result == {7: [], 8: []}

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


@pytest.mark.asyncio
async def test_transactie_suggesties_no_afspraken(test_request_context):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json=post_echo)

        get_transactions = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids=7,8", json={'data': [
                {'bedrag': None, 'customer_statement_message_id': 17, 'id': 7,
                 'information_to_account_owner': '/EREF/15814016000676480//CNTP/NL32INGB0000012345/INGBNL2A/J.Janssen///REMI/STRD/CUR/9001123412341234/',
                 'is_credit': None, 'is_geboekt': None, 'statement_line': '140220C32.00NTRF900112341234123408/',
                 'tegen_rekening': 'NL04RABO5082680188', 'transactie_datum': None},
                {'bedrag': None, 'customer_statement_message_id': 17, 'id': 8,
                 'information_to_account_owner': '/EREF/15614016000384600//CNTP/NL32INGB0000012345/INGBNL2A/INGBANK NV///REMI/STRD/CUR/1070123412341234/\n/SUM/4/4/134,46/36,58/\n\xad}',
                 'is_credit': None, 'is_geboekt': None, 'statement_line': '140220D-119.00NTRF107012341234123408/',
                 'tegen_rekening': 'NL29ABNA5179205913', 'transactie_datum': None}]})

        get_rekeningen = mock.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ibans=NL04RABO5082680188,NL29ABNA5179205913", json={
                'data': [{'afspraken': [4], 'gebruikers': [], 'iban': 'NL04RABO5082680188', 'id': 2, 'organisaties': [],
                          'rekeninghouder': 'Hema'},
                         {'afspraken': [3], 'gebruikers': [], 'iban': 'NL29ABNA5179205913', 'id': 3, 'organisaties': [],
                          'rekeninghouder': 'Shell'}]})

        get_afspraken = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_rekening=2,3", json={
                'data': []})

        result = await transactie_suggesties([7, 8])

        assert get_transactions.called_once
        assert get_rekeningen.called_once
        assert get_afspraken.called_once
        assert result == {7: [], 8: []}

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


@pytest.mark.asyncio
async def test_transactie_suggesties_no_rekeningen(test_request_context):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json=post_echo)

        get_transactions = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids=7,8", json={'data': [
                {'bedrag': None, 'customer_statement_message_id': 17, 'id': 7,
                 'information_to_account_owner': '/EREF/15814016000676480//CNTP/NL32INGB0000012345/INGBNL2A/J.Janssen///REMI/STRD/CUR/9001123412341234/',
                 'is_credit': None, 'is_geboekt': None, 'statement_line': '140220C32.00NTRF900112341234123408/',
                 'tegen_rekening': 'NL04RABO5082680188', 'transactie_datum': None},
                {'bedrag': None, 'customer_statement_message_id': 17, 'id': 8,
                 'information_to_account_owner': '/EREF/15614016000384600//CNTP/NL32INGB0000012345/INGBNL2A/INGBANK NV///REMI/STRD/CUR/1070123412341234/\n/SUM/4/4/134,46/36,58/\n\xad}',
                 'is_credit': None, 'is_geboekt': None, 'statement_line': '140220D-119.00NTRF107012341234123408/',
                 'tegen_rekening': 'NL29ABNA5179205913', 'transactie_datum': None}]})

        get_rekeningen = mock.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ibans=NL04RABO5082680188,NL29ABNA5179205913", json={
                'data': []})

        get_afspraken = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_rekening=2,3", json={
                'data': []})

        result = await transactie_suggesties([7, 8])

        assert get_transactions.called_once
        assert get_rekeningen.called_once
        assert not get_afspraken.called
        assert result == {7: [], 8: []}

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


@pytest.mark.asyncio
async def test_transactie_suggesties_no_transactions(test_request_context):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json=post_echo)

        get_transactions = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids=7,8", json={'data': []})

        get_rekeningen = mock.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ibans=NL04RABO5082680188,NL29ABNA5179205913", json={
                'data': []})

        get_afspraken = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_rekening=2,3", json={
                'data': []})

        result = await transactie_suggesties([7, 8])

        assert get_transactions.called_once
        assert not get_rekeningen.called_once
        assert not get_afspraken.called
        assert result == {7: [], 8: []}

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


@pytest.mark.asyncio
async def test_transactie_suggesties_multiple_zoektermen(test_request_context):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json=post_echo)

        get_transactions = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids=7", json={'data': [
                {'id': 7, 'information_to_account_owner': '15814016000676480 J.Janssen',
                 'tegen_rekening': 'NL04RABO5082680188', "transactie_datum": '2020-12-30'},
            ]})

        get_rekeningen = mock.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ibans=NL04RABO5082680188",
            json={'data': [
                {'afspraken': [4], 'iban': 'NL04RABO5082680188', 'id': 2},
            ]})

        get_afspraken = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_rekening=2", json={
                'data': [
                    {'id': 4, 'zoektermen': ['15814016000676480', 'Janssen'],
                     'tegen_rekening_id': 2, "valid_through": '2020-12-31'},
                ]})

        result = await transactie_suggesties([7])

        assert result == {7: [{'id': 4, 'tegen_rekening_id': 2,
                               'zoektermen': ['15814016000676480', 'Janssen'], "valid_through": '2020-12-31'}]}
        assert get_transactions.called_once
        assert get_rekeningen.called_once
        assert get_afspraken.called_once

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


@pytest.mark.asyncio
async def test_transactie_suggesties_multiple_zoektermen_too_specific(test_request_context):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, json={"data": []})
        post_any = mock.post(requests_mock.ANY, json=post_echo)

        get_transactions = mock.get(
            f"{settings.TRANSACTIE_SERVICES_URL}/banktransactions/?filter_ids=7", json={'data': [
                {'id': 7, 'information_to_account_owner': '15814016000676480 J.Janssen',
                 'tegen_rekening': 'NL04RABO5082680188'},
            ]})

        get_rekeningen = mock.get(
            f"{settings.HHB_SERVICES_URL}/rekeningen/?filter_ibans=NL04RABO5082680188",
            json={'data': [
                {'afspraken': [4], 'iban': 'NL04RABO5082680188', 'id': 2},
            ]})

        get_afspraken = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_rekening=2", json={
                'data': [
                    {'id': 4, 'zoektermen': ['15814016000676480', 'Janssen', 'Loon'],
                     'tegen_rekening_id': 2},
                ]})

        result = await transactie_suggesties([7])

        assert result == {7: []}
        assert get_transactions.called_once
        assert get_rekeningen.called_once
        assert get_afspraken.called_once

        # No leftover calls
        assert not post_any.called
        assert not get_any.called
