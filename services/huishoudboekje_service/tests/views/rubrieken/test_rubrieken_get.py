""" Test GET /rubrieken/(<rubriek_id>/) """
from models.afspraak import Afspraak

def test_rubriek_expose_afspraak(client, rubriek_factory, afspraak_factory):
    """ Test /afspraken/ path """
    rubriek = rubriek_factory.create_rubriek()
    afspraak = afspraak_factory.createAfspraak(kenmerk="Afspraak1", rubriek_id=rubriek.id)
    response = client.get(f'/rubrieken/{rubriek.id}')
    assert response.status_code == 200
    assert response.json["data"]["afspraken"] == [afspraak.id]
