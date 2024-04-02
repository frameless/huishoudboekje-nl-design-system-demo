# Core.Auth
This project contains the common authentication logic that is used for all huishoudboekje services.
All the grpc services can implement the auth interceptor to integrate the authentication.

### Env variables
The environment variables used to configure the authentication are:
 - **HHB_USE_AUTH**
 - **HHB_JWT_ISSUER**
 - **HHB_JWT_AUDIENCE**
 - **HHB_JWT_SECRET**
 - **HHB_JWT_ALLOWED_ALGORITHMS**
 - **HHB_JWT_JWKS_URI**


### Extra information
Some extra information on the authorisation can be found on the [wiki](https://gitlab.com/commonground/huishoudboekje/app-new/-/wikis/Architectuur-2024/Autorisatie)



