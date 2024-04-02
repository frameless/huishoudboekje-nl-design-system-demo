import pytest
import re
import requests_mock
import sys
from freezegun import freeze_time

from hhb_backend.audit_logging import AuditLogging
from hhb_backend.graphql import settings


# @freeze_time("2022-11-01 12:00:00")
# def test_audit_logging():
#     """This test checks if ... ."""
#     with requests_mock.Mocker() as rm:
#         fallback = rm.register_uri(requests_mock.ANY, requests_mock.ANY, status_code=404)
#         logservice_post = rm.post(re.compile(f"{settings.LOG_SERVICE_URL}/.*"), status_code=201, json={
#             "data": {
#                 "id": 42,
#                 "action": "create_foo",
#                 "entities": [
#                     {"name": "burger", "id": 1},
#                     {"name": "burger", "id": 2},
#                     {"name": "afspraak", "id": 69},
#                     {"name": "postadres", "id": "abc-123-def-456"},
#                 ],
#                 "snapshot_before": None,
#                 "snapshot_after": None,
#                 "gebruiker_id": None,
#                 "meta": {
#                     "user_agent": None,
#                     "ip": None
#                 },
#                 "timestamp": "2022-11-02T12:00:00"
#             }
#         })

#         # Initialize the AuditLogging client
#         al = AuditLogging()
#         result = al.create(action="create_foo", entities=[
#             {"name": "burger", "id": 1},
#             {"name": "burger", "id": 2},
#             {"name": "afspraak", "id": 69},
#             {"name": "postadres", "id": "abc-123-def-456"},
#         ])

#         print(f"result {result}")

#         assert logservice_post.call_count == 1
#         assert result.status_code == 201
#         assert result.json() == {
#             "data": {
#                 "id": 42,
#                 "action": "create_foo",
#                 "entities": [
#                     {"name": "burger", "id": 1},
#                     {"name": "burger", "id": 2},
#                     {"name": "afspraak", "id": 69},
#                     {"name": "postadres", "id": "abc-123-def-456"},
#                 ],
#                 "snapshot_before": None,
#                 "snapshot_after": None,
#                 "gebruiker_id": None,
#                 "meta": {
#                     "user_agent": None,
#                     "ip": None
#                 },
#                 "timestamp": "2022-11-02T12:00:00"
#             }
#         }
#         assert fallback.call_count == 0
