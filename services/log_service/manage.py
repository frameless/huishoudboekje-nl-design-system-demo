import os
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from log_service.app import create_app

app = create_app()
from core_service.database import db

app.config.from_object(os.getenv('APP_SETTINGS', 'log_service.config.DevelopmentConfig'))

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
