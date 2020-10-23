""" Test GET /rekeningen/(<rekening_id>/) """


def test_rekeningen_get_success_all(client, rekening_factory, gebruiker_factory, organisatie_factory):
    """ Test /rekeningen/ path """
    gebruiker = gebruiker_factory.createGebruiker()
    gebruiker_rekening = rekening_factory.create_gebruiker_rekening(gebruiker)
    organisatie = organisatie_factory.createOrganisatie()
    organisatie_rekening = rekening_factory.create_organisatie_rekening(organisatie)

    response = client.get(f'/rekeningen/')
    assert response.status_code == 200
    assert response.json["data"] == [gebruiker_rekening.to_dict(), organisatie_rekening.to_dict()]


def test_rekeningen_get_with_id(client, rekening_factory, gebruiker_factory):
    """ Test /rekeningen/<rekening_id>/ path """
    gebruiker = gebruiker_factory.createGebruiker()
    gebruiker_rekening = rekening_factory.create_gebruiker_rekening(gebruiker)

    response = client.get(f'/rekeningen/{gebruiker_rekening.id}/')
    assert response.status_code == 200
    assert response.json["data"] == gebruiker_rekening.to_dict()
    response = client.get(f'/organisaties/1337/')
    assert response.status_code == 404
    assert response.json["errors"] == ["Organisatie not found."]


def test_rekeningen_get_filter_ids(client, rekening_factory, gebruiker_factory):
    """ Test filter_ids on rekeningen """
    gebruiker1 = gebruiker_factory.createGebruiker()
    gebruiker_rekening1 = rekening_factory.create_gebruiker_rekening(gebruiker1)
    gebruiker2 = gebruiker_factory.createGebruiker(achternaam="Jansen")
    gebruiker_rekening2 = rekening_factory.create_gebruiker_rekening(gebruiker2, rekeninghouder="S. Jansen")

    response = client.get(f'/rekeningen/?filter_ids={gebruiker_rekening1.id}')
    assert response.status_code == 200
    assert response.json["data"] == [gebruiker_rekening1.to_dict()]
    response = client.get(f'/rekeningen/?filter_ids={gebruiker_rekening1.id},{gebruiker_rekening2.id}')
    assert response.status_code == 200
    assert response.json["data"] == [gebruiker_rekening1.to_dict(), gebruiker_rekening2.to_dict()]
    response = client.get('/rekeningen/?filter_ids=1337')
    assert response.status_code == 200
    assert response.json["data"] == []
    response = client.get('/rekeningen/?filter_ids=pietje')
    assert response.status_code == 400
    assert response.json["errors"] == ["Input for filter_ids is not correct"]


def test_rekeningen_get_filter_ibans(client, rekening_factory, gebruiker_factory):
    """ Test filter_ibans on rekeningen """
    gebruiker1 = gebruiker_factory.createGebruiker()
    gebruiker_rekening1 = rekening_factory.create_gebruiker_rekening(gebruiker1, iban="NL52ABNA7527421754")
    gebruiker2 = gebruiker_factory.createGebruiker(achternaam="Jansen")
    gebruiker_rekening2 = rekening_factory.create_gebruiker_rekening(gebruiker2, rekeninghouder="S. Jansen",
                                                                     iban="NL66RABO8214484995")

    response = client.get(f'/rekeningen/?filter_ibans={gebruiker_rekening1.iban}')
    assert response.status_code == 200
    assert response.json["data"] == [gebruiker_rekening1.to_dict()]
    response = client.get(f'/rekeningen/?filter_ibans={gebruiker_rekening1.iban},{gebruiker_rekening2.iban}')
    assert response.status_code == 200
    assert response.json["data"] == [gebruiker_rekening1.to_dict(), gebruiker_rekening2.to_dict()]
    response = client.get('/organisaties/?filter_ibans=1337')
    assert response.status_code == 200
    assert response.json["data"] == []


def test_rekeningen_get_filter_rekeninghouders(client, rekening_factory, gebruiker_factory):
    """ Test filter_rekeninghouders on rekeningen """
    gebruiker1 = gebruiker_factory.createGebruiker()
    gebruiker_rekening1 = rekening_factory.create_gebruiker_rekening(gebruiker1, iban="NL52ABNA7527421754")
    gebruiker2 = gebruiker_factory.createGebruiker(achternaam="Jansen")
    gebruiker_rekening2 = rekening_factory.create_gebruiker_rekening(gebruiker2, rekeninghouder="S. Jansen",
                                                                     iban="NL66RABO8214484995")

    response = client.get(f'/rekeningen/?filter_rekeninghouders={gebruiker_rekening1.rekeninghouder}')
    assert response.status_code == 200
    assert response.json["data"] == [gebruiker_rekening1.to_dict()]
    response = client.get(
        f'/rekeningen/?filter_rekeninghouders={gebruiker_rekening1.rekeninghouder},{gebruiker_rekening2.rekeninghouder}')
    assert response.status_code == 200
    assert response.json["data"] == [gebruiker_rekening1.to_dict(), gebruiker_rekening2.to_dict()]
    response = client.get('/organisaties/?filter_rekeninghouders=1337')
    assert response.status_code == 200
    assert response.json["data"] == []
