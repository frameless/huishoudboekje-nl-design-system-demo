""" Test GET /rubrieken/(<rubriek_id>/) """
from models.afspraak import Afspraak

def test_rubriek_expose_afspraak(client, rubriek_factory, afspraak_factory):
    """ Test /rubrieken/ path """
    rubriek = rubriek_factory.create_rubriek()
    afspraak = afspraak_factory.createAfspraak(kenmerk="Afspraak1", rubriek_id=rubriek.id)
    response = client.get(f'/rubrieken/{rubriek.id}')
    assert response.status_code == 200
    assert response.json["data"]["afspraken"] == [afspraak.id]

def test_rubriek_get_filter_grootboekrekening(client, rubriek_factory, afspraak_factory):
    """ Test /rubrieken/?filter_grootboekrekeningen=.... path """
    rubriek1 = rubriek_factory.create_rubriek()
    rubriek2 = rubriek_factory.create_rubriek()
    rubriek1.grootboekrekening_id = "Test"
    rubriek2.grootboekrekening_id = "Test2"
    response = client.get(f'/rubrieken/?filter_grootboekrekeningen={rubriek1.grootboekrekening_id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["id"] == rubriek1.id
    response = client.get(f'/rubrieken/?filter_grootboekrekeningen={rubriek2.grootboekrekening_id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["id"] == rubriek2.id