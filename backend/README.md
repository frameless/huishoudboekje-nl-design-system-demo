
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

## Run with docker

```shell script
docker run --rm -it -v `pwd`/etc:/app/etc registry.gitlab.com/commonground/huishoudboekje/app-new/backend:dev
```
