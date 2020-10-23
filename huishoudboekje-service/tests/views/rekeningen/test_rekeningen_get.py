""" Test GET /rekeningen/(<rekening_id>/) """
from core.utils import row2dict

def test_rekeningen_get_success_all(client, rekening_factory):
    """ Test /rekeningen/ path """
    rekening = rekening_factory.create_rekening()
    rekening2 = rekening_factory.create_rekening(rekeninghouder="Bla")

    response = client.get(f'/rekeningen/')
    assert response.status_code == 200
    assert response.json["data"] == [row2dict(rekening), row2dict(rekening2)]


def test_rekeningen_get_with_id(client, rekening_factory):
    """ Test /rekeningen/<rekening_id>/ path """
    rekening = rekening_factory.create_rekening()

    response = client.get(f'/rekeningen/{rekening.id}/')
    assert response.status_code == 200
    assert response.json["data"] == row2dict(rekening)
    response = client.get(f'/organisaties/1337/')
    assert response.status_code == 404
    assert response.json["errors"] == ["Organisatie not found."]


def test_rekeningen_get_filter_ids(client, rekening_factory):
    """ Test filter_ids on rekeningen """
    rekening = rekening_factory.create_rekening()
    rekening2 = rekening_factory.create_rekening(rekeninghouder="Bla")

    response = client.get(f'/rekeningen/?filter_ids={rekening.id}')
    assert response.status_code == 200
    assert response.json["data"] == [row2dict(rekening)]
    response = client.get(f'/rekeningen/?filter_ids={rekening.id},{rekening2.id}')
    assert response.status_code == 200
    assert response.json["data"] == [row2dict(rekening), row2dict(rekening2)]
    response = client.get('/rekeningen/?filter_ids=1337')
    assert response.status_code == 200
    assert response.json["data"] == []
    response = client.get('/rekeningen/?filter_ids=pietje')
    assert response.status_code == 400
    assert response.json["errors"] == ["Input for filter_ids is not correct, 'pietje' is not a number."]


def test_rekeningen_get_filter_ibans(client, rekening_factory):
    """ Test filter_ibans on rekeningen """
    rek1 = rekening_factory.create_rekening(iban="NL52ABNA7527421754")
    rek2 = rekening_factory.create_rekening(rekeninghouder="S. Jansen",
                                                                     iban="NL66RABO8214484995")

    response = client.get(f'/rekeningen/?filter_ibans={rek1.iban}')
    assert response.status_code == 200
    assert response.json["data"] == [row2dict(rek1)]
    response = client.get(f'/rekeningen/?filter_ibans={rek1.iban},{rek2.iban}')
    assert response.status_code == 200
    assert response.json["data"] == [row2dict(rek1), row2dict(rek2)]
    response = client.get('/organisaties/?filter_ibans=1337')
    assert response.status_code == 200
    assert response.json["data"] == []


def test_rekeningen_get_filter_rekeninghouders(client, rekening_factory):
    """ Test filter_rekeninghouders on rekeningen """
    rek1 = rekening_factory.create_rekening(iban="NL52ABNA7527421754")
    rek2 = rekening_factory.create_rekening(rekeninghouder="S. Jansen",
                                                                     iban="NL66RABO8214484995")

    response = client.get(f'/rekeningen/?filter_rekeninghouders={rek1.rekeninghouder}')
    assert response.status_code == 200
    assert response.json["data"] == [row2dict(rek1)]
    response = client.get(
        f'/rekeningen/?filter_rekeninghouders={rek1.rekeninghouder},{rek2.rekeninghouder}')
    assert response.status_code == 200
    assert response.json["data"] == [row2dict(rek1), row2dict(rek2)]
    response = client.get('/organisaties/?filter_rekeninghouders=1337')
    assert response.status_code == 200
    assert response.json["data"] == []
