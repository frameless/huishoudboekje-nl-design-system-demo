---
"huishoudboekje": major
---

Extracted authorization to a separate service that is compatible with OpenID Connect

## Migration guide

### Authservice 

A new application called `authservice` has been added to the deployment. Please see k8s/authservice for the Kubernetes specification. 
The following environment variables should be added to your deployment for the `authservice`:

```shell
OIDC_ISSUER_URL="{your issuer url}"
OIDC_CLIENT_ID="{your client id}"
OIDC_CLIENT_SECRET="{your client secret}"
OIDC_BASE_URL="{the url on which the application is running}"
JWT_ISSUER="{the issuer of the JWT. Eg. huishoudboekje}"
JWT_AUDIENCE="{the issuer of the JWT. Eg. huishoudboekje}"
JWT_EXPIRES_IN="{the issuer of the JWT. Eg. 30d}"
```

### Backend

The environment variables `AUTH_AUDIENCE`, `OIDC_ISSUER`, `OIDC_AUTHORIZATION_ENDPOINT`, `OIDC_TOKEN_ENDPOINT`, `OIDC_TOKENINFO_ENDPOINT` and `OIDC_USERINFO_ENDPOINT`
for the `backend` application have become obsolete and should be removed from your deployment.
