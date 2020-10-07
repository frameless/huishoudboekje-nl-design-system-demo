# Huishoudboekje Service

This service contains the functionality needed to access data that belongs to the Huishoudboekje processes.
 
## Project Layout

## Setup

```shell script
pip install -r requirements.txt
```
### Layer 1 (database)

#### models
Contains ORM models for Huishoudboekje Service

#### migrations
Database migration schema

#### database
Non functional Flask app, functions as a manager app for database migrations

##### Create new migration
```shell script
python manage.py db migrate
```

##### Apply migrations on database
```shell script
python manage.py db upgrade
```
### Layer 2 (services)

#### core
[API documentation](docs/openapi.yaml)

```shell script
export FLASK_APP="core.app"
flask run
```

##### ENV Settings
```.env
export HHB_SECRET="local-secret"

export HHB_DATABASE_URL="postgresql://hhb_user:hhb_pass@localhost/hhb"

export APP_SETTINGS="database.config.DevelopmentConfig"
```

