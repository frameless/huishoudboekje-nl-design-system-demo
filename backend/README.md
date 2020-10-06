
# HuishoudBoekje Backend
Laag 4 in het Common Ground-lagenmodel. GraphQL-backendserver

## Installatie
Normale installatie

```
python3 setup.py install
```

Development instalatie
```
pip install -e .
```
of
```
pip install -r requirements.txt
```
     
### Packages toevoegen

Dependencies moeten gedefinieerd worden in `setup.py`.

## Run with docker

```shell script
docker run --rm -it -v `pwd`/etc:/app/etc registry.gitlab.com/commonground/huishoudboekje/app-new/backend:dev
```
