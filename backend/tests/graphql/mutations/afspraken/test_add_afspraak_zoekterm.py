import requests_mock

from hhb_backend.graphql import settings


def get_json_payload(zoekterm):
    return {
                "query": '''
                    mutation test($afspraakId: Int!, $zoekterm: String!) {
                        addAfspraakZoekterm(afspraakId: $afspraakId, zoekterm: $zoekterm) {
                            afspraak {
                                id
                                zoektermen
                            }
                            matchingAfspraken {
                                id
                                zoektermen
                            }
                        }
                    }
                    ''',
                "variables": {"afspraakId": 1, "zoekterm": zoekterm}
            }


def test_add_afspraak_zoekterm_success_1(client):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)
        log_post = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
        afspraken_get = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1",
            json={"data": [{
                "id": 1, "zoektermen": ["Albert Heijn"], "tegen_rekening_id": 14,
                "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []
            }]}
        )
        afspraken_get_rekening = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_rekening=14",
            json={"data": [
                {
                    "id": 1, "zoektermen": ["Albert Heijn"], "tegen_rekening_id": 14,
                    "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []
                },
                {
                    "id": 2, "zoektermen": ["Albert Heijn", "loon"], "tegen_rekening_id": 14,
                    "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []
                }
            ]}
        )

        afspraak = {"data": {
            "id": 1, "zoektermen": ["Albert Heijn", "salaris"], "tegen_rekening_id": 14,
            "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []        
        }}
        afspraken_post = mock.post(f"{settings.HHB_SERVICES_URL}/afspraken/1", json=afspraak)

        response = client.post(
            "/graphql",
            json=get_json_payload("salaris"),
        )
        assert response.json == {'data': {'addAfspraakZoekterm': {
            'afspraak': {'id': 1, 'zoektermen': ['Albert Heijn', 'salaris']}, 'matchingAfspraken': []
        }}}
        assert afspraken_get.called_once
        assert afspraken_post.called
        assert log_post.called_once
        assert afspraken_get_rekening.called_once

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


def test_add_afspraak_zoekterm_conflict_1(client):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)
        log_post = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
        afspraken_get = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1",
            json={"data": [{
                "id": 1, "zoektermen": ["Albert Heijn"], "tegen_rekening_id": 14,
                "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []
            }]}
        )
        afspraken_get_rekening = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_rekening=14",
            json={"data": [
                {
                    "id": 1, "zoektermen": ["Albert Heijn"], "tegen_rekening_id": 14,
                    "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []
                },
                {
                    "id": 2, "zoektermen": ["Albert Heijn", "loon"], "tegen_rekening_id": 14,
                    "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []
                }
            ]}
        )

        afspraak = {"data": {
            "id": 1, "zoektermen": ["Albert Heijn", "loonbetaling"], "tegen_rekening_id": 14,
            "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []        
        }}
        afspraken_post = mock.post(f"{settings.HHB_SERVICES_URL}/afspraken/1", json=afspraak)

        response = client.post(
            "/graphql",
            json=get_json_payload("loonbetaling"),
        )
        assert response.json == {'data': {'addAfspraakZoekterm': {
            'afspraak': {'id': 1, 'zoektermen': ['Albert Heijn', 'loonbetaling']},
            'matchingAfspraken': [{'id': 2, 'zoektermen': ['Albert Heijn', 'loon']}]
        }}}
        assert afspraken_get.called_once
        assert afspraken_post.called
        assert log_post.called_once
        assert afspraken_get_rekening.called_once

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


def test_add_afspraak_zoekterm_conflict_2(client):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)
        log_post = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
        afspraken_get = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1",
            json={"data": [{
                "id": 1, "zoektermen": ["Albert Heijn", "loon"], "tegen_rekening_id": 14,
                "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []
            }]}
        )
        afspraken_get_rekening = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_rekening=14",
            json={"data": [
                {
                    "id": 1, "zoektermen": ["Albert Heijn", "loon"], "tegen_rekening_id": 14,
                    "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []
                },
                {
                    "id": 2, "zoektermen": ["Albert Heijn", "loonbetaling"], "tegen_rekening_id": 14,
                    "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []
                }
            ]}
        )

        afspraak = {"data": {
            "id": 1, "zoektermen": ["Albert Heijn", "loon", "betaling"], "tegen_rekening_id": 14,
            "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []        
        }}
        afspraken_post = mock.post(f"{settings.HHB_SERVICES_URL}/afspraken/1", json=afspraak)

        response = client.post(
            "/graphql",
            json=get_json_payload("betaling"),
        )
        assert response.json == {'data': {'addAfspraakZoekterm': {
            'afspraak': {'id': 1, 'zoektermen': ['Albert Heijn', 'loon', 'betaling']},
            'matchingAfspraken': [{'id': 2, 'zoektermen': ['Albert Heijn', 'loonbetaling']}]
        }}}
        assert afspraken_get.called_once
        assert afspraken_post.called
        assert log_post.called_once
        assert afspraken_get_rekening.called_once

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


def test_add_afspraak_zoekterm_success_2(client):
    with requests_mock.Mocker() as mock:
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)
        log_post = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/", json={"data": {"id": 1}})
        afspraken_get = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1",
            json={"data": [{
                "id": 1, "zoektermen": ["Albert Heijn", "loon "], "tegen_rekening_id": 14,
                "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []
            }]}
        )
        afspraken_get_rekening = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_rekening=14",
            json={"data": [
                {
                    "id": 1, "zoektermen": ["Albert Heijn", "loon "], "tegen_rekening_id": 14,
                    "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []
                },
                {
                    "id": 2, "zoektermen": ["Albert Heijn", "loonbetaling"], "tegen_rekening_id": 14,
                    "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []
                }
            ]}
        )

        afspraak = {"data": {
            "id": 1, "zoektermen": ["Albert Heijn", "loon ", "betaling"], "tegen_rekening_id": 14,
            "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []        
        }}
        afspraken_post = mock.post(f"{settings.HHB_SERVICES_URL}/afspraken/1", json=afspraak)

        response = client.post(
            "/graphql",
            json=get_json_payload("betaling"),
        )
        assert response.json == {'data': {'addAfspraakZoekterm': {
            'afspraak': {'id': 1, 'zoektermen': ['Albert Heijn', 'loon ', 'betaling']},
            'matchingAfspraken': []
        }}}
        assert afspraken_get.called_once
        assert afspraken_post.called
        assert log_post.called_once
        assert afspraken_get_rekening.called_once

        # No leftover calls
        assert not post_any.called
        assert not get_any.called


def test_add_afspraak_zoekterm_conflict_3(client):
    with requests_mock.Mocker() as mock:
        afspraak1 = {
            "id": 1, "zoektermen": ["Albert Heijn", "loon "], "tegen_rekening_id": 14,
            "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []        
        }
        afspraak2 = {
            "id": 2, "zoektermen": ["Albert Heijn", "loon betaling"], "tegen_rekening_id": 14,
            "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []
        }
        get_any = mock.get(requests_mock.ANY, status_code=404)
        post_any = mock.post(requests_mock.ANY, status_code=404)
        log_post = mock.post(f"{settings.LOG_SERVICE_URL}/gebruikersactiviteiten/")
        afspraken_get = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_ids=1",
            json={"data": [afspraak1]}
        )
        afspraken_get_rekening = mock.get(
            f"{settings.HHB_SERVICES_URL}/afspraken/?filter_rekening=14",
            json={"data": [
                afspraak1,
                afspraak2
            ]}
        )
        afspraak1a = {"data": {
            "id": 1, "zoektermen": ["Albert Heijn", "loon ", "betaling"], "tegen_rekening_id": 14,
            "valid_from": "2020-01-01", "valid_through": None, "journaalposten": [], "overschrijvingen": []        
        }}
        afspraken_post = mock.post(f"{settings.HHB_SERVICES_URL}/afspraken/1", json=afspraak1a)

        response = client.post(
            "/graphql",
            json=get_json_payload("betaling"),
        )
        
        assert afspraken_get.called_once
        assert afspraken_post.called
        assert afspraken_get_rekening.call_count == 1
        assert log_post.call_count == 1

        # No leftover calls
        assert not post_any.called
        assert not get_any.called

        assert response.json == {'data': {'addAfspraakZoekterm': {
            'afspraak': {'id': 1, 'zoektermen': ['Albert Heijn', 'loon ', 'betaling']},
            'matchingAfspraken': [{'id': 2, 'zoektermen': ['Albert Heijn', 'loon betaling']}]
        }}}
