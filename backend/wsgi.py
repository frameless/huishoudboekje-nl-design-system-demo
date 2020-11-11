import os

from hhb_backend.app import create_app

app = create_app(config_name=os.getenv('APP_SETTINGS', None) or 'hhb_backend.config.ProductionConfig')
