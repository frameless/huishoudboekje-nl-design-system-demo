def test_overschrijving_filter_afspraak_id(client, overschrijving_factory):
    overschrijving1 = overschrijving_factory.create_overschrijving(afspraak_id=10)
    overschrijving2 = overschrijving_factory.create_overschrijving(afspraak_id=11)
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
    response = client.get(f'/afspraken/?filter_ids={overschrijving2.afspraak_id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["afspraak_id"] == overschrijving2.afspraak_id


def test_afspraak_filter_invalid_id(client):
    response = client.get(f'/overschrijvingen/?filter_afspraken=NaN')
    assert response.status_code == 400
    assert response.json["errors"][0] == "Input for filter_ids is not correct, 'NaN' is not a number."
