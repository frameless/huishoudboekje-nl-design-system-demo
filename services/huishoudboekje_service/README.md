# Huishoudboekjeservice

This service contains the functionality needed to access data that belongs to the Huishoudboekje processes.
 
## Setup development (Mac and Unix)

- Install dependencies
    ```shell
    pip install -r requirements.txt
    ```

- Put in `.envrc`:
    ```shell
    export PATH=/Applications/Postgres.app/Contents/Versions/13/bin:$PATH
    export FLASK_APP="huishoudboekje_service.app"
    export FLASK_RUN_PORT="8000"
    export FLASK_ENV="development"
    export HHB_SECRET="local-secret"
    export HHB_DATABASE_URL="postgresql://huishoudboekjeservice:huishoudboekjeservice@localhost/huishoudboekjeservice"
    export APP_SETTINGS="huishoudboekje_service.config.DevelopmentConfig"
    ```

- setup db (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)
    ```shell
    createuser --echo --login --host localhost --username postgres huishoudboekjeservice
    createdb --echo --owner huishoudboekjeservice --host localhost --username postgres huishoudboekjeservice
    psql --host localhost --username postgres --dbname postgres --command "ALTER USER huishoudboekjeservice WITH ENCRYPTED PASSWORD 'huishoudboekjeservice';"
    python manage.py db upgrade
    ```

- run app
    ```shell script
    flask run
    ```

## Setup development (Windows)
- Make sure you have a symbolic link to core_services \
    delete the core_service file \
    Execute a shell as administrator

    ```shell
    mklink /D "core_service" ..\\core_service\\core_service
    ```


- Install a virtual environment \
    make sure your working directory is ~\backend

    ```shell
    cd ..\
    virtualenv huishoudboekje_service
    cd huishoudboekje_service
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
    set FLASK_APP=huishoudboekje_service.app
    set FLASK_RUN_PORT=8000
    set FLASK_ENV="development"
    set HHB_SECRET="local-secret"
    set HHB_DATABASE_URL=postgresql://huishoudboekjeservice:huishoudboekjeservice@localhost/huishoudboekjeservice
    set APP_SETTINGS=huishoudboekje_service.config.DevelopmentConfig
    ```

- Activate the virtual environment
    ```shell
    Scripts\\activate
    ```

- setup db (make sure you have a PostgreSQL database up and running. See [root README](../../README.md) on how to do this)

- Using [pgAdmin](https://www.pgadmin.org/):
  - Create login/Group ROLE:
    ```text  
    Name = huishoudboekjeservice
    Password = huishoudboekjeservice
    Privileges: Can login ON
                Superuser ON
    ```
    - Create Database:
    ```text
    name = huishoudboekjeservice
    Owner = huishoudboekjeservice
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
Contains ORM models for Huishoudboekje Service

#### Migrations
Database migration schema

##### Create new migration
```shell script
python manage.py db migrate
```


### Layer 2 (services)

#### core
[API documentation](docs/openapi.yaml)