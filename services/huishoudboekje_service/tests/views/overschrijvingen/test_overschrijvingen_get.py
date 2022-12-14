


def test_overschrijving_filter_afspraak_id(client, overschrijving_factory, afspraak_factory):
    afspraak1 = afspraak_factory.createAfspraak(zoektermen="Afspraak1")
    afspraak2 = afspraak_factory.createAfspraak(zoektermen="Afspraak2")
    overschrijving1 = overschrijving_factory.create_overschrijving(afspraak_id=afspraak1.id)
    overschrijving2 = overschrijving_factory.create_overschrijving(afspraak_id=afspraak2.id)
    response = client.get(
        f'/overschrijvingen/?filter_afspraken={overschrijving1.afspraak_id},{overschrijving2.afspraak_id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["afspraak_id"] == overschrijving1.afspraak_id
    assert response.json["data"][1]["afspraak_id"] == overschrijving2.afspraak_id
    response = client.get(f'/overschrijvingen/?filter_afspraken={overschrijving1.afspraak_id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["afspraak_id"] == overschrijving1.afspraak_id
    response = client.get(f'/overschrijvingen/?filter_afspraken={overschrijving2.afspraak_id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["afspraak_id"] == overschrijving2.afspraak_id


def test_afspraak_filter_invalid_id(client):
    response = client.get(f'/overschrijvingen/?filter_afspraken=1225')
    assert response.status_code == 200
    assert response.json["data"] == []
