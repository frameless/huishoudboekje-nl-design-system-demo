# Huishoudboekje

## Development

The frontend component requires the latest version of Node.js.

- `npm install` will install all dependencies that are required to run the app.
- `npm start` runs the application in development mode.
- `npm run theme {yourThemeName}` will install `../theme/{yourThemeName}` into `public/theme`. 
  Installing a theme is optional, the Sloothuizen-theme will be used by default.

Please note that for ESLint to work, you will need to put the following lines in your `.env` file:

```bash
EXTEND_ESLINT=true

# If you want your app to talk to a backend on another host (for example a review branch 
# or your local running backend), set this host (and port) here.
PROXY=https://hhb-518.nlx.reviews

# Authorization through OIDC doesn't work in dev mode, we use a JsonWebToken to authorize directly against the proxy.
PROXY_AUTHORIZATION={YOUR_JWT_HERE}

# -= OPTIONAL BELOW =-

# This prevents your browser window from opening after starting the app.
BROWSER=none 

# Fast refresh doesn't really work that well, so advice is to disable it.
FAST_REFRESH=false
```

### Authorization

Review apps can be used as backend instead of a local setup. The url to be used can be found on the MR page as the `View App` button.
The authentication can be done using a jwt token which can be obtained from the `/api/me` endpoint after succesful login.
Just use that as the value of `PROXY_AUTHORIZATION`.