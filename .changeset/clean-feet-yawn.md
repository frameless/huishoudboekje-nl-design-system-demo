---
"huishoudboekje": minor
---

Fixed #950: Moved configuration for client secrets to environment variables
Fixed #975: Extracted authorization to a separate service that is compatible with OpenID Connect

## Migration guide

### Authservice

A new application called `authservice` has been added to the deployment. Please see k8s/authservice for the Kubernetes specification.
The following environment variables should be added to your deployment for the `authservice`:

```shell
OIDC_ISSUER_URL=https://your-identity-provider.example.com/auth
OIDC_CLIENT_ID=huishoudboekje-medewerkers
OIDC_CLIENT_SECRET=your-idp-client-secret
OIDC_BASE_URL=https://your-app.example.com
JWT_ISSUER=your-app-issuer
JWT_EXPIRES_IN=30d
JWT_AUDIENCE=your-app-audience # <-- This value must be the same for authservice and backend.
JWT_SECRET=long-random-string # <-- This value must be the same for authservice and backend.
```

### Backend

The following environment variables should be added to your deployment for the `backend`:

```shell
JWT_SECRET=long-random-string # <-- This value must be the same for authservice and backend.
JWT_AUDIENCE=your-app-audience # <-- This value must be the same for authservice and backend.
```

The following environment variables have become obsolete and should be removed from this deployment:

```shell
OIDC_ISSUER
OIDC_AUTHORIZATION_ENDPOINT
OIDC_TOKEN_ENDPOINT
OIDC_TOKENINFO_ENDPOINT
OIDC_USERINFO_ENDPOINT
OIDC_CLOCK_SKEW
OIDC_CLIENT_SECRETS
AUTH_AUDIENCE
HHB_SECRET
SECRET_KEY
```

## Services

The following environment variables have become obsolete and should be removed from the deployments of the alarmenservice, banktransactieservice, 
grootboekservice, huishoudboekjeservice, logservice, organisatieservice, postadressenservice and the signalenservice:

```shell
HHB_SECRET
SECRET_KEY
```
