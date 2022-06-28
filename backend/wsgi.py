import os

from hhb_backend.app import create_app

app = create_app(config_name='hhb_backend.config.Config')
