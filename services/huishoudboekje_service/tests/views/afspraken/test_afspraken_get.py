""" Test GET /afspraken/(<afspraak_id>/) """
from models.afspraak import Afspraak

def test_afspraak_get_success_multiple(client, afspraak_factory):
    """ Test /afspraken/ path """
    afspraak1 = afspraak_factory.createAfspraak(kenmerk="Afspraak1")
    afspraak2 = afspraak_factory.createAfspraak(kenmerk="Afspraak2")
    response = client.get(f'/afspraken/')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["kenmerk"] == afspraak1.kenmerk
    assert response.json["data"][1]["kenmerk"] == afspraak2.kenmerk

def test_afspraak_get_success_single(client, afspraak_factory):
    """ Test /afspraken/ path """
    afspraak1 = afspraak_factory.createAfspraak(kenmerk="Afspraak1")
    afspraak2 = afspraak_factory.createAfspraak(kenmerk="Afspraak2")
    response = client.get(f'/afspraken/{afspraak2.id}')
    assert response.status_code == 200
    assert response.json["data"]["kenmerk"] == afspraak2.kenmerk

def test_afspraak_get_failure_not_found(client):
    response = client.get('/afspraken/1337')
    assert response.status_code == 404
    assert response.json["errors"][0] == "Afspraak not found."

def test_afspraak_filter_columns(client, afspraak_factory):
    afspraak1 = afspraak_factory.createAfspraak(kenmerk="Afspraak1")
    afspraak2 = afspraak_factory.createAfspraak(kenmerk="Afspraak2")
    response = client.get('/afspraken/?columns=id,kenmerk')
    assert response.status_code == 200
    assert response.json["data"] == [
        {"id": afspraak1.id, "kenmerk": afspraak1.kenmerk},
        {"id": afspraak2.id, "kenmerk": afspraak2.kenmerk}
    ]
    response = client.get(f'/afspraken/{afspraak2.id}?columns=id,kenmerk')
    assert response.status_code == 200
    assert response.json["data"] == {"id": afspraak2.id, "kenmerk": afspraak2.kenmerk}

def test_afspraak_filter_invalid_column(client):
    response = client.get('/afspraken/?columns=non-field')
    assert response.status_code == 400
    assert response.json["errors"][0] == "Input for columns is not correct, 'non-field' is not a column."

def test_afspraak_filter_ids(client, afspraak_factory):
    afspraak1 = afspraak_factory.createAfspraak(kenmerk="Afspraak1")
    afspraak2 = afspraak_factory.createAfspraak(kenmerk="Afspraak2")
    response = client.get(f'/afspraken/?filter_ids={afspraak1.id},{afspraak2.id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["kenmerk"] == afspraak1.kenmerk
    assert response.json["data"][1]["kenmerk"] == afspraak2.kenmerk
    response = client.get(f'/afspraken/?filter_ids={afspraak1.id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["kenmerk"] == afspraak1.kenmerk
    response = client.get(f'/afspraken/?filter_ids={afspraak2.id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["kenmerk"] == afspraak2.kenmerk

def test_afspraak_filter_invalid_id(client):
    response = client.get(f'/afspraken/?filter_ids=NaN')
    assert response.status_code == 400
    assert response.json["errors"][0] == "Input for filter_ids is not correct, 'NaN' is not a number."

def test_afspraak_get_filter_gebruikers(client, afspraak_factory, gebruiker_factory):
    gebruiker1 = gebruiker_factory.createGebruiker()
    gebruiker2 = gebruiker_factory.createGebruiker()
    afspraak1 = afspraak_factory.createAfspraak(gebruiker=gebruiker1, kenmerk="Afspraak1")
    afspraak2 = afspraak_factory.createAfspraak(gebruiker=gebruiker1, kenmerk="Afspraak2")
    afspraak3 = afspraak_factory.createAfspraak(gebruiker=gebruiker2, kenmerk="Afspraak3")
    response = client.get(f'/afspraken/?filter_gebruikers={gebruiker1.id}')
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["kenmerk"] == afspraak1.kenmerk
    assert response.json["data"][1]["kenmerk"] == afspraak2.kenmerk
    response = client.get(f'/afspraken/?filter_gebruikers={gebruiker2.id}')
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["kenmerk"] == afspraak3.kenmerk
    response = client.get(f'/afspraken/?filter_gebruikers={gebruiker1.id},{gebruiker2.id}')
    assert len(response.json["data"]) == 3
    assert response.json["data"][0]["kenmerk"] == afspraak1.kenmerk
    assert response.json["data"][1]["kenmerk"] == afspraak2.kenmerk
    assert response.json["data"][2]["kenmerk"] == afspraak3.kenmerk
    response = client.get(f'/afspraken/?filter_gebruikers=1337')
    assert response.json["data"] == []
    response = client.get(f'/afspraken/?filter_gebruikers=a')
    assert response.json["errors"][0] == "Input for filter_gebruikers is not correct, 'a' is not a number."

def test_afspraak_get_filter_organisaties(client, afspraak_factory, organisatie_factory):
    organisatie1 = organisatie_factory.createOrganisatie(kvk_nummer="1", weergave_naam="Organisatie1")
    organisatie2 = organisatie_factory.createOrganisatie(kvk_nummer="2", weergave_naam="Organisatie2")
    afspraak1 = afspraak_factory.createAfspraak(organisatie_id=organisatie1.id, kenmerk="Afspraak1")
    afspraak2 = afspraak_factory.createAfspraak(organisatie_id=organisatie1.id, kenmerk="Afspraak2")
    afspraak3 = afspraak_factory.createAfspraak(organisatie_id=organisatie2.id, kenmerk="Afspraak3")
    response = client.get(f'/afspraken/?filter_organisaties={organisatie1.id}')
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["kenmerk"] == afspraak1.kenmerk
    assert response.json["data"][1]["kenmerk"] == afspraak2.kenmerk
    response = client.get(f'/afspraken/?filter_organisaties={organisatie2.id}')
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["kenmerk"] == afspraak3.kenmerk
    response = client.get(f'/afspraken/?filter_organisaties={organisatie1.id},{organisatie2.id}')
    assert len(response.json["data"]) == 3
    assert response.json["data"][0]["kenmerk"] == afspraak1.kenmerk
    assert response.json["data"][1]["kenmerk"] == afspraak2.kenmerk
    assert response.json["data"][2]["kenmerk"] == afspraak3.kenmerk
    response = client.get(f'/afspraken/?filter_organisaties=1337')
    assert response.json["data"] == []
    response = client.get(f'/afspraken/?filter_organisaties=a')
    assert response.json["errors"][0] == "Input for filter_organisaties is not correct, 'a' is not a number."

def test_afspraak_get_journaalpost_relation(client, afspraak_factory, journaalpost_factory):
    afspraak = afspraak_factory.createAfspraak(kenmerk="Afspraak")
    journaalpost1 = journaalpost_factory.create_journaalpost(afspraak_id=afspraak.id)
    journaalpost2 = journaalpost_factory.create_journaalpost(afspraak_id=afspraak.id)
    response = client.get(f'/afspraken/{afspraak.id}')
    assert len(response.json["data"]["journaalposten"]) == 2
    assert response.json["data"]["journaalposten"][0] == journaalpost1.id
    assert response.json["data"]["journaalposten"][1] == journaalpost2.id