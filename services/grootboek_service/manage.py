from flask.cli import FlaskGroup

from grootboek_service.app import create_app

app = create_app()

app.config.from_object('grootboek_service.config.Config')

cli = FlaskGroup(app)

if __name__ == '__main__':
    cli()
