

# hhb_services

## Management

### ENV Settings

export HHB_SECRET="local-secret"

export HHB_DATABASE_URL="postgresql://hhb_user:hhb_pass@localhost/hhb"

export APP_SETTINGS="hhb_services.config.DevelopmentConfig"

### Create migration

python manage.py db migrate

### Apply migrations

python manage.py db upgrade

## Services

### Gebruikers service

[API documentation](docs/gebruikers_service/openapi.yaml)

export FLASK_APP="gebruikers_service.app"

flask run
