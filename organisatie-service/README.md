# Organisatie Service

This service contains the functionality needed to access data that belongs to the Organisatie processes.
 
## Setup

- Python environment
    ```shell script
    pip install -r requirements.txt
    ```

- Postgres
  > for macOS you can use [Postgres.app](https://postgresapp.com/)
    ```
    PATH=/Applications/Postgres.app/Contents/Versions/13/bin:$PATH
    createuser --echo --login --host localhost --username postgres organisatieservice
    createdb --echo --owner organisatieservice --host localhost --username postgres organisatieservice
    psql --host localhost --username postgres --dbname postgres --command "ALTER USER organisatieservice WITH ENCRYPTED PASSWORD 'organisatieservice';"
    ```

## Project Layout

### Layer 1 (database)

#### models
Contains ORM models for Organisatie Service

#### migrations
Database migration schema

##### Create new migration
```shell script
python manage.py db migrate
```

##### Apply migrations on database
```shell script
export ORGANISATIE_DATABASE_URL="postgresql://organisatieservice:organisatieservice@localhost/organisatieservice"
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
export ORGANISATIE_DATABASE_URL="postgresql://huishoudboekjeservice:huishoudboekjeservice@localhost/huishoudboekjeservice"
export APP_SETTINGS="core.config.DevelopmentConfig"

flask run
```

