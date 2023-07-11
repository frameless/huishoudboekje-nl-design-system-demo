import json

from models import Huishouden


def test_huishoudens_post_new_huishouden(client, session):
    assert session.query(Huishouden).count() == 0
    huishouden_dict = {}
    response = client.post('/huishoudens/', data=json.dumps(huishouden_dict), content_type='application/json')
    assert response.status_code == 201
    huishouden_dict["id"] = 1
    responseJson = response.json["data"]
    responseJson.pop('uuid')

    assert responseJson == huishouden_dict
    assert session.query(Huishouden).count() == 1
