

# hhb_services

## Management

### ENV Settings

export HHB_SECRET="local-secret"                         
export HHB_DATABASE_URL="postgresql://<user>:<password>@<host>/<database>"
export APP_SETTINGS=hhb_services.config.DevelopmentConfig

### Create migration

python manage.py db migrate

### Apply migrations

python manage.py db upgrade

## Services

### Gebruikers service

export FLASK_APP=gebruikers_service.app
flask run
