
# HuishoudBoekje Backend
Layer 4 in the Common Ground-layermodel. GraphQL-backendserver

## Instalation
Normal instalation

```
python3 setup.py install
```

Development instalation
```
pip install -e .
```
or
```
pip install -r requirements.txt
```
     
### Adding Packages

Dependencies have to be defined in `setup.py`.

## Run 

### local

```shell script
export FLASK_APP="hhb_backend.app"
export FLASK_ENV="development"
export FLASK_RUN_PORT="5000"
export APP_SETTINGS="hhb_backend.config.DevelopmentConfig"
export PREFIX=/api
export HHB_SERVICE_URL=http://localhost:8000
export ORGANISATIE_SERVICE_URL=http://localhost:8001
export TRANSACTIE_SERVICE_URL=http://localhost:8002
export GROOTBOEK_SERVICE_URL=http://localhost:8003

flask run
```

### with docker

```shell script
docker run --rm -it -v `pwd`/etc:/app/etc registry.gitlab.com/commonground/huishoudboekje/app-new/backend:dev
```
