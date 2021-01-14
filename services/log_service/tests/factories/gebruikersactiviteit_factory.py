""" Factories to generate objects within a test scope """
from datetime import datetime

from models.gebruikersactiviteit import GebruikersActiviteit


class GebruikersActiviteitFactory():
    """ Factory for GebruikersActiviteit objects """

    def __init__(self, session):
        self.dbsession = session

    def create_gebruikersactiviteit(
            self,
            timestamp: datetime = datetime.utcnow(),
            gebruiker_id: int = 1,
            action: str = "update",
            entities: str = '''[
    {
      "entityType": "burger",
      "entityId": 1
    }
  ]
''',
            snapshot_before: str = '''{
    "voornamen": "Dirk"
  }
''',
            snapshot_after: str = '''{
    "burger": {
      "voornamen": "Dirk Jan"
    }
  }
''',
            meta: str = '''{
    "userAgent": "Browser/1.0",
    "ip": "127.0.0.1",
    "applicationVersion": "0.20.0"
  }
'''
    ):
        ga = GebruikersActiviteit(
            timestamp=timestamp,
            gebruiker_id=gebruiker_id,
            action=action,
            entities=entities,
            snapshot_before=snapshot_before,
            snapshot_after=snapshot_after,
            meta=meta
        )
        self.dbsession.add(ga)
        self.dbsession.flush()
        return ga
