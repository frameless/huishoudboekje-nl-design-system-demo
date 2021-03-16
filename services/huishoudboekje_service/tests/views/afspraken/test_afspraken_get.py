""" Test GET /afspraken/(<afspraak_id>/) """


def test_afspraak_get_success_multiple(client, afspraak_factory):
    """ Test /afspraken/ path """
    afspraak1 = afspraak_factory.createAfspraak(zoektermen="Afspraak1")
    afspraak2 = afspraak_factory.createAfspraak(zoektermen="Afspraak2")
    response = client.get(f'/afspraken/')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["zoektermen"] == afspraak1.zoektermen
    assert response.json["data"][1]["zoektermen"] == afspraak2.zoektermen


def test_afspraak_get_success_single(client, afspraak_factory):
    """ Test /afspraken/ path """
    afspraak1 = afspraak_factory.createAfspraak(zoektermen="Afspraak1")
    afspraak2 = afspraak_factory.createAfspraak(zoektermen="Afspraak2")
    response = client.get(f'/afspraken/{afspraak2.id}')
    assert response.status_code == 200
    assert response.json["data"]["zoektermen"] == afspraak2.zoektermen


def test_afspraak_get_failure_not_found(client):
    response = client.get('/afspraken/1337')
    assert response.status_code == 404
    assert response.json["errors"][0] == "Afspraak not found."


def test_afspraak_filter_columns(client, afspraak_factory):
    afspraak1 = afspraak_factory.createAfspraak(zoektermen=["Afspraak1"])
    afspraak2 = afspraak_factory.createAfspraak(zoektermen=["Afspraak2"])
    response = client.get('/afspraken/?columns=id,zoektermen')
    assert response.status_code == 200
    assert response.json["data"] == [
        {"id": afspraak1.id, "zoektermen": afspraak1.zoektermen},
        {"id": afspraak2.id, "zoektermen": afspraak2.zoektermen}
    ]
    response = client.get(f'/afspraken/{afspraak2.id}?columns=id,zoektermen')
    assert response.status_code == 200
    assert response.json["data"] == {"id": afspraak2.id, "zoektermen": afspraak2.zoektermen}


def test_afspraak_filter_invalid_column(client):
    response = client.get('/afspraken/?columns=non-field')
    assert response.status_code == 400
    assert response.json["errors"][0] == "Input for columns is not correct, 'non-field' is not a column."


def test_afspraak_filter_ids(client, afspraak_factory):
    afspraak1 = afspraak_factory.createAfspraak(zoektermen="Afspraak1")
    afspraak2 = afspraak_factory.createAfspraak(zoektermen="Afspraak2")
    response = client.get(f'/afspraken/?filter_ids={afspraak1.id},{afspraak2.id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["zoektermen"] == afspraak1.zoektermen
    assert response.json["data"][1]["zoektermen"] == afspraak2.zoektermen
    response = client.get(f'/afspraken/?filter_ids={afspraak1.id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["zoektermen"] == afspraak1.zoektermen
    response = client.get(f'/afspraken/?filter_ids={afspraak2.id}')
    assert response.status_code == 200
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["zoektermen"] == afspraak2.zoektermen


def test_afspraak_filter_invalid_id(client):
    response = client.get(f'/afspraken/?filter_ids=NaN')
    assert response.status_code == 400
    assert response.json["errors"][0] == "Input for filter_ids is not correct, 'NaN' is not a number."


def test_afspraak_get_filter_burgers(client, afspraak_factory, burger_factory):
    burger1 = burger_factory.createBurger()
    burger2 = burger_factory.createBurger()
    afspraak1 = afspraak_factory.createAfspraak(burger=burger1, zoektermen="Afspraak1")
    afspraak2 = afspraak_factory.createAfspraak(burger=burger1, zoektermen="Afspraak2")
    afspraak3 = afspraak_factory.createAfspraak(burger=burger2, zoektermen="Afspraak3")
    response = client.get(f'/afspraken/?filter_burgers={burger1.id}')
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["zoektermen"] == afspraak1.zoektermen
    assert response.json["data"][1]["zoektermen"] == afspraak2.zoektermen
    response = client.get(f'/afspraken/?filter_burgers={burger2.id}')
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["zoektermen"] == afspraak3.zoektermen
    response = client.get(f'/afspraken/?filter_burgers={burger1.id},{burger2.id}')
    assert len(response.json["data"]) == 3
    assert response.json["data"][0]["zoektermen"] == afspraak1.zoektermen
    assert response.json["data"][1]["zoektermen"] == afspraak2.zoektermen
    assert response.json["data"][2]["zoektermen"] == afspraak3.zoektermen
    response = client.get(f'/afspraken/?filter_burgers=1337')
    assert response.json["data"] == []
    response = client.get(f'/afspraken/?filter_burgers=a')
    assert response.json["errors"][0] == "Input for filter_burgers is not correct, 'a' is not a number."


def test_afspraak_get_filter_organisaties(client, afspraak_factory, organisatie_factory):
    organisatie1 = organisatie_factory.createOrganisatie(kvk_nummer="1", weergave_naam="Organisatie1")
    organisatie2 = organisatie_factory.createOrganisatie(kvk_nummer="2", weergave_naam="Organisatie2")
    afspraak1 = afspraak_factory.createAfspraak(organisatie_id=organisatie1.id, zoektermen="Afspraak1")
    afspraak2 = afspraak_factory.createAfspraak(organisatie_id=organisatie1.id, zoektermen="Afspraak2")
    afspraak3 = afspraak_factory.createAfspraak(organisatie_id=organisatie2.id, zoektermen="Afspraak3")
    response = client.get(f'/afspraken/?filter_organisaties={organisatie1.id}')
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["zoektermen"] == afspraak1.zoektermen
    assert response.json["data"][1]["zoektermen"] == afspraak2.zoektermen
    response = client.get(f'/afspraken/?filter_organisaties={organisatie2.id}')
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["zoektermen"] == afspraak3.zoektermen
    response = client.get(f'/afspraken/?filter_organisaties={organisatie1.id},{organisatie2.id}')
    assert len(response.json["data"]) == 3
    assert response.json["data"][0]["zoektermen"] == afspraak1.zoektermen
    assert response.json["data"][1]["zoektermen"] == afspraak2.zoektermen
    assert response.json["data"][2]["zoektermen"] == afspraak3.zoektermen
    response = client.get(f'/afspraken/?filter_organisaties=1337')
    assert response.json["data"] == []
    response = client.get(f'/afspraken/?filter_organisaties=a')
    assert response.json["errors"][0] == "Input for filter_organisaties is not correct, 'a' is not a number."


def test_afspraak_get_journaalpost_relation(client, afspraak_factory, journaalpost_factory):
    afspraak = afspraak_factory.createAfspraak(zoektermen="Afspraak")
    journaalpost1 = journaalpost_factory.create_journaalpost(afspraak_id=afspraak.id)
    journaalpost2 = journaalpost_factory.create_journaalpost(afspraak_id=afspraak.id)
    response = client.get(f'/afspraken/{afspraak.id}')
    assert len(response.json["data"]["journaalposten"]) == 2
    assert response.json["data"]["journaalposten"][0] == journaalpost1.id
    assert response.json["data"]["journaalposten"][1] == journaalpost2.id

def test_afspraak_get_filter_rekening(client, afspraak_factory, rekening_factory):
    rekening1 = rekening_factory.create_rekening()
    rekening2 = rekening_factory.create_rekening(iban="NL42ABNA6879970117", rekeninghouder="Klaas")
    afspraak1 = afspraak_factory.createAfspraak(tegen_rekening=rekening1, zoektermen="Afspraak1")
    afspraak2 = afspraak_factory.createAfspraak(tegen_rekening=rekening2, zoektermen="Afspraak2")
    response = client.get(f'/afspraken/?filter_rekening={rekening1.id}')
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["zoektermen"] == afspraak1.zoektermen
    response = client.get(f'/afspraken/?filter_rekening={rekening2.id}')
    assert len(response.json["data"]) == 1
    assert response.json["data"][0]["zoektermen"] == afspraak2.zoektermen
    response = client.get(f'/afspraken/?filter_rekening={rekening1.id},{rekening2.id}')
    assert len(response.json["data"]) == 2
    assert response.json["data"][0]["zoektermen"] == afspraak1.zoektermen
    assert response.json["data"][1]["zoektermen"] == afspraak2.zoektermen
    response = client.get(f'/afspraken/?filter_burgers=1337')
    assert response.json["data"] == []
    response = client.get(f'/afspraken/?filter_burgers=a')
    assert response.json["errors"][0] == "Input for filter_burgers is not correct, 'a' is not a number."