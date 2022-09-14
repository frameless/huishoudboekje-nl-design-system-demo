from flask.cli import FlaskGroup

from log_service.app import create_app

app = create_app()
from core_service.database import db

app.config.from_object('log_service.config.Config')

cli = FlaskGroup(app)

if __name__ == '__main__':
    cli()
