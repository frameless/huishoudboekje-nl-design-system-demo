# Huishoudboekje

## Development

The frontend component requires the latest version of Node.js.

- `npm start` runs the application in development mode.
- `npm run theme {yourThemeName}` will install `../theme/{yourThemeName}` into `public/theme`.

### Review App

Review apps can be used as backend instead of a local setup. The url to be used can be found on the MR page as the `View App` button.

The authentication can be done using a jwt token which can be obtained from the `/api/me` endpoint after succesful login.

```shell script
PROXY_AUTHORIZATION="Authorization: Bearer <token>" \
PROXY=https://hhb-<feature-slug>.nlx.reviews npm start
```

The test environment can also be used

```shell script
PROXY_AUTHORIZATION="Authorization: Bearer <token>" \
PROXY=https://test.huishoudboekje.demoground.nl npm start
```


Alternatively the token can be generated using the SESSION_SECRET variable from GitLab for the environment using

```shell
PROXY_AUTHORIZATION="Authorization: Bearer $(npx --quiet --package '@clarketm/jwt-cli' \
    jwt sign \
    --expiresIn "1 hour" \
    --subject "cypress@huishoudboekje.nlx.reviews" \
    --issuer "https://huishoudboekje.nlx.reviews" \
    --audience "https://huishoudboekje.nlx.reviews" \
    --jwtid "$(tr -dc 'A-F0-9' < /dev/urandom | head -c32)" \
    --noCopy \
    "{}" "${SESSION_SECRET:-test}")"
```