""" Test POST /gebruikersactiviteiten """
from datetime import datetime

from dateutil import tz


def test_configuraties_post_success(app):
    """ Test successful post of new gebruikersactiviteit"""
    ga_data = {
        "timestamp": datetime(2020, 10, 1, tzinfo=tz.tzlocal()).isoformat(),
        "gebruiker_id": "henk@example.com",
        "action": "update",
        "entities": [
            {
                "entityType": "burger",
                "entityId": 1
            }
        ],
        "snapshot_before": {
            "voornamen": "Dirk"
        },
        "snapshot_after": {
            "burger": {
                "voornamen": "Dirk Jan"
            }
        },
        "meta": {
            "userAgent": "Browser/1.0",
            "ip": "127.0.0.1",
            "applicationVersion": "0.20.0"
        }
    }
    response = app.test_client().post('/gebruikersactiviteiten/', json=ga_data)
    assert response.status_code == 201
    ga_data["id"] = 1
    responseJson = response.json["data"]
    responseJson.pop('uuid')
    assert responseJson == ga_data
