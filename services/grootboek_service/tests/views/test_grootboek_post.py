""" Test POST /grootboekrekeningen/(<grootboekrekeningen_id>/) """
import json
from models import Grootboekrekening

def test_grootboeken_post(client, dbsession, grootboekrekening_factory):
    """ Test /grootboekrekeningen/ path """
    parent = grootboekrekening_factory.create_grootboekrekening("1")
    assert dbsession.query(Grootboekrekening).count() == 1
    grootboek_dict = {
        "id": "1337",
        "naam": "New Grootboek",
        "parent_id": parent.id
    }
    response = client.post(
        '/grootboekrekeningen/',
        data=json.dumps(grootboek_dict),
        content_type='application/json'
    )
    assert response.status_code == 201
    assert response.json["data"]["id"] == grootboek_dict["id"]
    assert response.json["data"]["naam"] == grootboek_dict["naam"]
    assert response.json["data"]["parent_id"] == grootboek_dict["parent_id"]
    assert dbsession.query(Grootboekrekening).count() == 2
