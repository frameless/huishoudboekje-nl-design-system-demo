""" Factories to generate objects within a test scope """
from datetime import datetime

import pytest

from models import Export


class ExportFactory():
    """ Factory for Export objects """

    def __init__(self, session):
        self.dbsession = session
        self.counter = 0

    def createExport(
        self,
        naam: str = None,
        timestamp: datetime = datetime.utcnow(),
    ):
        if not naam:
            self.counter += 1
            naam = f'export-{timestamp}-{self.counter:05d}.pain'

        export = Export(
            naam=naam,
            timestamp=timestamp,
        )

        self.dbsession.add(export)
        self.dbsession.flush()
        return export

@pytest.fixture(scope="function")
def export_factory(session, request):
    """
    creates an instance of the ExportFactory with function scope dbsession
    """
    return ExportFactory(session)
