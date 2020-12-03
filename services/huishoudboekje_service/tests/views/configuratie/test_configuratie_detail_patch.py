""" Test PATCH /configuratie/<configuratie_id> """
import json
from datetime import date
from models import Configuratie
from core_service.utils import row2dict


def test_configuraties_detail_patch_success(client, configuratie_factory):
    """ Test a successful POST on configuratie_detail """
    configuratie = configuratie_factory.createConfiguratie()
    edited_configuratie = configuratie
    edited_configuratie.waarde = str(date(1990, 1, 1))
    response = client.post('/configuratie/ab_45', json=row2dict(edited_configuratie))
    assert response.status_code == 200
    assert response.json["data"] == row2dict(edited_configuratie)
