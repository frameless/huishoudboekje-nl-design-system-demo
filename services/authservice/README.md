# Welcome to the authorization service 👋

A little Node.js REST API that handles user authentication with an OpenID Connect Identity Provider.

# Setup

### Required environment variables

Example `.env`:

```dotenv
OIDC_ISSUER_URL=https://your-identity-provider.example.com/auth
OIDC_CLIENT_ID=huishoudboekje-medewerkers
OIDC_CLIENT_SECRET=your-idp-client-secret
OIDC_BASE_URL=https://your-app.example.com
JWT_ISSUER=your-app-issuer
JWT_AUDIENCE=your-app-audience
JWT_EXPIRES_IN=30d
JWT_SECRET=long-random-string
```

# Usage
To start the application run `npm start`. Without any additional configuration, the application will run on port 8080 by default.
