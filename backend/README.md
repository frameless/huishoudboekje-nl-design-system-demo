
# HuishoudBoekje Backend
Layer 4 in the Common Ground-layermodel. GraphQL-backendserver

## Installation
Normal installation

```
python3 setup.py install
```

## Development
### local
- Install dependencies
    ```shell
    pip install -e .
    ```
    or
    ```shell
    pip install -r requirements.txt
    ```

- Put in `.envrc`:
    ```shell
    export FLASK_APP="hhb_backend.app"
    export FLASK_ENV="development"
    export FLASK_RUN_PORT="5000"
    export APP_SETTINGS="hhb_backend.config.DevelopmentConfig"
    export PREFIX=/api
    export HHB_SERVICE_URL=http://localhost:8000
    export ORGANISATIE_SERVICE_URL=http://localhost:8001
    export TRANSACTIE_SERVICE_URL=http://localhost:8002
    export GROOTBOEK_SERVICE_URL=http://localhost:8003
    export LOG_SERVICE_URL=http://localhost:8004
    ```

- in `hbb_backend/app.py` for the function `auth_graphql()`, change `MEDEWERKER_ROLENAME` into `ANONYMOUS_ROLENAME` \
  (__WARNING__: make sure to not check in this change!)
  
- run app
    ```shell script
    flask run
    ```

### with docker

```shell script
docker run --rm -it -v `pwd`/etc:/app/etc registry.gitlab.com/commonground/huishoudboekje/app-new/backend:dev
```
     
### Adding Packages

Dependencies have to be defined in `setup.py`.
