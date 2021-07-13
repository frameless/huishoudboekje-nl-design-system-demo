# Grootboekservice

This service contains the functionality needed to access data from grootboeken.
 
## Setup development (Mac and Unix)

- Install dependencies
    ```shell
    pip install -r requirements.txt
    ```

- Put in `.envrc`:
    ```shell
    export PATH=/Applications/Postgres.app/Contents/Versions/13/bin:$PATH
    export FLASK_APP="grootboek_service.app"
    export FLASK_RUN_PORT="8003"
    export FLASK_ENV="development"
    export HHB_SECRET="local-secret"
    export GROOTBOEK_DATABASE_URL="postgresql://grootboekservice:grootboekservice@localhost/grootboekservice"
    export APP_SETTINGS="grootboek_service.config.DevelopmentConfig"
    ```

- setup db (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)
    ```shell
    createuser --echo --login --host localhost --username postgres grootboekservice
    createdb --echo --owner grootboekservice --host localhost --username postgres grootboekservice
    psql --host localhost --username postgres --dbname postgres --command "ALTER USER grootboekservice WITH ENCRYPTED PASSWORD 'grootboekservice';"
    python manage.py db upgrade
    ```

- run app
    ```shell script
    flask run
    ```

## Setup development (Windows)
- Make sure you have a symbolic link to core_services

    delete the core_service file

    Execute a shell as administrator

    ```shell
    mklink /D "core_service" ..\\core_service\\core_service
    ```


- Install a virtual environment

    make sure your working directory is ~\backend

    ```shell
    cd ..\
    virtualenv grootboek_service
    cd grootboek_service
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
    set FLASK_APP=grootboek_service.app
    set FLASK_RUN_PORT=8003
    set FLASK_ENV="development"
    set HHB_SECRET="local-secret"
    set GROOTBOEK_DATABASE_URL=postgresql://grootboekservice:grootboekservice@localhost/grootboekservice
    set APP_SETTINGS=grootboek_service.config.DevelopmentConfig
    ```

- Activate the virtual environment
    ```shell
    Scripts\\activate
    ```

- setup db (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)

- Using [pgAdmin](https://www.pgadmin.org/):
  - Create login/Group ROLE:
    ```text
    Name = grootbroekservice
    Password = grootboekservice
    Privileges: Can login ON
                Superuser ON 
    ```
  - Create Database:
    ```text
    name = grootboekservice
    Owner = grootboekservice
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
Contains ORM models for the Grootboekservice

#### Migrations
Database migration schema

##### Create new migration
```shell script
python manage.py db migrate
```


### Layer 2 (services)

#### grootboek_service
[API documentation](docs/openapi.yaml)