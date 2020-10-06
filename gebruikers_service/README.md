# Huishoudboekje Gebruikers Service

## Project Layout

## Setup

```shell script
pip install -r requirements.txt
```
### hhb_services
Non functional Flask app, functions as a manager app for databas migrations and global Flask elements

### Layer 1 (database)

#### hhb_models
Contains ORM models for HHB

#### migrations
Database migration schema

##### Create new migration
```shell script
python manage.py db migrate
```

##### Apply migrations on database
```shell script
python manage.py db upgrade
```
### Layer 2 (services)

### gebruikers_service
[API documentation](docs/gebruikers_service/openapi.yaml)

```shell script
export FLASK_APP="gebruikers_core.app"
flask run
```

### ENV Settings
```.env
export HHB_SECRET="local-secret"

export HHB_DATABASE_URL="postgresql://hhb_user:hhb_pass@localhost/hhb"

export APP_SETTINGS="hhb_services.config.DevelopmentConfig"
```

