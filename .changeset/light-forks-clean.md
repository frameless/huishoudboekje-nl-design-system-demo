---
"huishoudboekje": minor
---

Reworked the auth service flow. authenticating will now:
New:

- /me will now also verify token validity.
- error and 401 any invalid tokens.
- app-token will now be correctly inherited from JWT and use the given expire time as setup in the oidc provider.
- correctly dispose of the active session and cookies upon logout or when /me fails to authorize the user/token is invalid.
- request for a refetch token using offline_access scope because some oidc providers do not give this by default
- handle refetch using the tokens correcty (see removed)

Removed:

- Auth-service will no longer refresh tokens because this is handled by express-openid-connect in the background
- auth app will no longer sign jwt tokens by getting user info from the previous token
- app-token cookies will no longer be valid for 30d even when the JWT_TOKEN_EXPIRES_IN env var was set to something else
