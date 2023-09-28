---
"huishoudboekje": minor
---
Auth service was not up-to-par with current security standards and required a rework on the flow to properly handle JWT tokens of different OIDC providers

Changes:
- JWT tokens are not re-signed by the authservice, but are inherited from the incoming JWT
- JWT encoding now supports both symetric and asymetric algorithms (HSA(HS), RSA(RS), RSA-PSS(PS), EC(ES)) in 256, 384 and 512 format.
    - By default the app allows no algorithm, the allowed algorithms should be set in the JWT_ALGORITHMS env var for both authservice and backend.
- Tokens are verified on /me calls instead of only app-token verify by the backend
- If an asymetric algorithm is used, the authservice and backend will get the public key from the oidc provider's JWKS endpoint
- Authservice and Backend wil both verify the token seperately to ensure safety of the data.
- Added JWT_ISSUER env var to backend (already available in authservice)
- Better handling of session logout and cookie removal

Removed:
- Auth-service will no longer refresh tokens because this is handled by express-openid-connect in the background
- Backend will no longer verify self-signed cookies
- auth app will no longer sign jwt tokens by getting user info from the previous token
- app-token cookies will no longer be valid for 30d even when the JWT_VALIDITY env var was set to something else
