```shell
REALM_NAME=huishoudboekje
KEYCLOAK_BASE_URL=https://keycloak.huishoudboekje.demoground.nl
```

To perform a full import of realm, clients and users:

```shell
npm run start -- full-import
```

To add a redirect URI to an existing client:

```shell
npm run start -- request-uri add --uri=https://hhb-955.nlx.reviews --client-id=huishoudboekje-medewerkers
```

To remove a redirect URI from an existing client:

```shell
npm run start -- request-uri remove --uri=https://hhb-955.nlx.reviews --client-id=huishoudboekje-medewerkers
```
