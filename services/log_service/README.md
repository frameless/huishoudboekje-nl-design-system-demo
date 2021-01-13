# Transactie Service

This service contains the functionality needed to access data from the application logging
 
## Setup

- Python environment
    ```shell script
    pip install -r requirements.txt
    ```

- Postgres
  > for macOS you can use [Postgres.app](https://postgresapp.com/)
    ```
    PATH=/Applications/Postgres.app/Contents/Versions/13/bin:$PATH
    createuser --echo --login --host localhost --username postgres logservice
    createdb --echo --owner logservice --host localhost --username postgres logservice
    psql --host localhost --username postgres --dbname postgres --command "ALTER USER logservice WITH ENCRYPTED PASSWORD 'logservice';"
    ```

## Project Layout

### Layer 1 (database)

#### models
Contains ORM models for the Log Service

#### migrations
Database migration schema

##### Create new migration
```shell script
python manage.py db migrate
```

##### Apply migrations on database
```shell script
export LOG_DATABASE_URL="postgresql://logservice:logservice@localhost/logservice"
python manage.py db upgrade
```
### Layer 2 (services)

#### log_service
[API documentation](docs/openapi.yaml)

Prerequisites:

```shell script
export FLASK_APP="log_service.app"
export FLASK_RUN_PORT="8002"
export FLASK_ENV="development"
export HHB_SECRET="local-secret"
export TRANSACTIE_DATABASE_URL="postgresql://logservice:logservice@localhost/logservice"
export APP_SETTINGS="log_service.config.DevelopmentConfig"

flask run
```

