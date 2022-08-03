
from hhb_backend.graphql import settings

model = "afdelingen"
service = settings.ORGANISATIE_SERVICES_URL
error =  {'data': {'deleteAfdeling': None}, 
    'errors': [{
        'locations': [{'column': 21, 'line': 3}], 
        'message': 'Opgevraagde afdelingen bestaan niet.', 
        'path': ['deleteAfdeling']
        }]
    }