# Huishoudboekje Service

This service contains the functionality needed to access data that belongs to the Huishoudboekje processes.
 
## Setup

- Python environment
    ```shell script
    pip install -r requirements.txt
    ```

- Postgres
  > for macOS you can use [Postgres.app](https://postgresapp.com/)
    ```
    PATH=/Applications/Postgres.app/Contents/Versions/13/bin:$PATH
    createuser --echo --login --host localhost --username postgres huishoudboekjeservice
    createdb --echo --owner huishoudboekjeservice --host localhost --username postgres huishoudboekjeservice
    psql --host localhost --username postgres --dbname postgres --command "ALTER USER huishoudboekjeservice WITH ENCRYPTED PASSWORD 'huishoudboekjeservice';"
    ```

## Project Layout

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
export HHB_DATABASE_URL="postgresql://huishoudboekjeservice:huishoudboekjeservice@localhost/huishoudboekjeservice"
python manage.py db upgrade
```
### Layer 2 (services)

#### core
[API documentation](docs/openapi.yaml)

Prerequisites:

```shell script
export FLASK_APP="core.app"
export FLASK_RUN_PORT="5001"
export FLASK_ENV="development"
export HHB_SECRET="local-secret"
export HHB_DATABASE_URL="postgresql://huishoudboekjeservice:huishoudboekjeservice@localhost/huishoudboekjeservice"
export APP_SETTINGS="core.config.DevelopmentConfig"

flask run
```

