# Huishoudboekje

## Development

The frontend component requires the latest version of Node.js.

- `npm start` runs the application in development mode.
- `npm run theme {yourThemeName}` will install `../theme/{yourThemeName}` into `public/theme`.

### Review App

Review apps can be used as backend instead of a local setup. The url to be used can be found on the MR page as the `View App` button.

```shell script
PROXY=https://hhb-<feature-slug>.nlx.reviews npm start
```

The test environment can also be used

```shell script
PROXY=https://hhb-test.nlx.reviews npm start
```
