---
"huishoudboekje": minor
---

Fixed #955: We've removed the bundled Keycloak from the repository, as we're using a separately deployed Keycloak for our own testing purposes.
This change should not affect your current deployment configuration if you were already not using the bundled Keycloak as the authentication provider.

## Migration guide

The following environment variables have become obsolete and should be removed from your deployment configuration:

```shell
USE_KEYCLOAK
KEYCLOAK_DB_DATABASE
KEYCLOAK_DB_USER
KEYCLOAK_DB_SCHEMA
KEYCLOAK_DB_PASSWORD
KEYCLOAK_AUTH_USERNAME
KEYCLOAK_AUTH_PASSWORD
KEYCLOAK_AUTH_KEYCLOAK_URL
KEYCLOAK_CLIENT_ROOT_URL
KEYCLOAK_CLIENT_SECRET
KEYCLOAK_CLIENT_USERS
```