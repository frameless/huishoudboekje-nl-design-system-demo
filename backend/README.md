
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
export PREFIX=/api
export OIDC_CLIENT_SECRETS=etc/hhb-test.client_secrets.json
export OIDC_REDIRECT_URI="http://localhost:3000/api/oidc_callback"
export HHB_SERVICE_URL=http://localhost:5001

flask run
```

### with docker

```shell script
docker run --rm -it -v `pwd`/etc:/app/etc registry.gitlab.com/commonground/huishoudboekje/app-new/backend:dev
```
