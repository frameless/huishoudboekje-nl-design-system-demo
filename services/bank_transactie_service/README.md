# Transactieservice

This service contains the functionality needed to access data from banktransactions.
 
## Setup development (Mac and Unix)

- Install dependencies
    ```shell
    pip install -r requirements.txt
    ```

- Put in `.envrc`:
    ```shell
    export PATH=/Applications/Postgres.app/Contents/Versions/13/bin:$PATH
    export FLASK_APP="bank_transactie_service.app"
    export FLASK_RUN_PORT="8002"
    export FLASK_ENV="development"
    export HHB_SECRET="local-secret"
    export TRANSACTIE_DATABASE_URL="postgresql://transactieservice:transactieservice@localhost/transactieservice"
    export APP_SETTINGS="bank_transactie_service.config.DevelopmentConfig"
    ```

- setup db (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)
    ```shell
    createuser --echo --login --host localhost --username postgres transactieservice
    createdb --echo --owner transactieservice --host localhost --username postgres transactieservice
    psql --host localhost --username postgres --dbname postgres --command "ALTER USER transactieservice WITH ENCRYPTED PASSWORD 'transactieservice';"
    python manage.py db upgrade
    ```

- run app
    ```shell script
    flask run
    ```


## Setup development (Windows)
- Make sure you have a symbolic link to core_services
    Execute a shell as administrator

    ```shell
    mklink /D "core_service" ..\\core_service\\core_service
    ```


- Install a virtual environment

    make sure your working directory is ~\backend

    ```shell
    cd ..\
    virtualenv bank_transactie_service
    cd bank_transacties_service
    Scripts\\activate
    ```

- Install dependencies in the virtual environment
    ```shell
    pip install -e .
    ```
    or
    ```shell
    pip install -r requirements.txt
    ```

- Deactivate the virtual environment
    ```shell
    deactivate
    ```

- Put in `Scripts\activate.bat`:
    ```shell
    set PATH=/Applications/Postgres.app/Contents/Versions/13/bin;%PATH%
    set FLASK_APP=bank_transactie_service.app
    set FLASK_RUN_PORT=8002
    set FLASK_ENV="development"
    set HHB_SECRET="local-secret"
    set TRANSACTIE_DATABASE_URL=postgresql://transactieservice:transactieservice@localhost/transactieservice
    set APP_SETTINGS=bank_transactie_service.config.DevelopmentConfig
    ```

- Activate the virtual environment
    ```shell
    Scripts\\activate
    ```

- setup db (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)

- Using [pgAdmin](https://www.pgadmin.org/):
  - Create login/Group ROLE:
    ```text
    Name = transactieservice
    Password = transactieservice
    Privileges: Can login ON
                Superuser ON
    ```

  - Create Database:
    ```text
    name = transactieservice
    Owner = transactieservice
    ```

- Run database upgrade
    ```shell
    py manage.py db upgrade
    ```

- run app
    ```shell script
    flask run
    ```


## Project Layout

### Layer 1 (database)

#### Models
Contains ORM models for the Transactionservice

#### Migrations
Database migration schema

##### Create new migration
```shell script
python manage.py db migrate
```

### Layer 2 (services)

#### bank_transactie_service
[API documentation](docs/openapi.yaml)