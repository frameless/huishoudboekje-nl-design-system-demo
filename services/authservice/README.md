# Welcome to the authorization service 👋

A little Node.js REST API that handles user authentication with an OpenID Connect Identity Provider.

# Setup

### Required environment variables

Example `.env`:

```dotenv
OIDC_ISSUER_URL=http://your-microsoft-identity-provider.com/auth/realms
OIDC_CLIENT_ID=huishoudboekje-medewerkers
OIDC_CLIENT_SECRET=fc36d31f-f720-4914-a750-b83c7b0dd61c
OIDC_BASE_URL=http://localhost:3000
JWT_ISSUER=huishoudboekje_localhost
JWT_AUDIENCE=huishoudboekje_localhost
JWT_EXPIRES_IN=30d
```

# Usage
To start the application run `npm start`. Without any additional configuration, the application will run on port 8080 by default.
