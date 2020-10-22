""" Test GET /afspraken/(<afspraak_id>/) """
from models.afspraak import Afspraak
from core.utils import row2dict

def test_afspraak_get_success_multiple(client, afspraak_factory):
    """ Test /afspraken/ path """
    afspraak1 = afspraak_factory.createAfspraak()
    afspraak2 = afspraak_factory.createAfspraak()
    response = client.get('/afspraken/')
    assert response.status_code == 200
    assert response.json["data"] == [row2dict(afspraak1), row2dict(afspraak2)]

def test_afspraak_get_success_single(client, afspraak_factory):
    """ Test /afspraken/ path """
    afspraak1 = afspraak_factory.createAfspraak()
    afspraak2 = afspraak_factory.createAfspraak()
    response = client.get(f'/afspraken/{afspraak2.id}')
    assert response.status_code == 200
    assert response.json["data"] == row2dict(afspraak2)

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

def test_afspraak_filter_invalid_column(client, afspraak_factory):
    response = client.get('/afspraken/?columns=non-field')
    assert response.status_code == 400
    assert response.json["errors"][0] == "Input for columns is not correct, 'non-field' is not a column."

def test_afspraak_filter_ids(client, afspraak_factory):
    afspraak1 = afspraak_factory.createAfspraak(kenmerk="Afspraak1")
    afspraak2 = afspraak_factory.createAfspraak(kenmerk="Afspraak2")
    response = client.get(f'/afspraken/?filter_ids={afspraak1.id},{afspraak2.id}')
    assert response.status_code == 200
    assert response.json["data"] == [row2dict(afspraak1), row2dict(afspraak2)]
    response = client.get(f'/afspraken/?filter_ids={afspraak1.id}')
    assert response.status_code == 200
    assert response.json["data"] == [row2dict(afspraak1)]
    response = client.get(f'/afspraken/?filter_ids={afspraak2.id}')
    assert response.status_code == 200
    assert response.json["data"] == [row2dict(afspraak2)]

def test_afspraak_filter_invalid_id(client, afspraak_factory):
    response = client.get(f'/afspraken/?filter_ids=NaN')
    assert response.status_code == 400
    assert response.json["errors"][0] == "Input for filter_ids is not correct, 'NaN' is not a number."
