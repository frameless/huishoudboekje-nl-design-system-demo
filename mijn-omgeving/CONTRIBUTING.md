# Contributing

Thank you for showing interest to contribute to the Huishoudboekje Mijn Omgeving-component!
Please make sure you have read our [contributing guidelines](../CONTRIBUTING.md) in the root of this repository first.

## For developers

This component can be worked on in a React application. To launch this component in development mode, just install dependencies and start up the application.

```shell
npm i
npm start
```

You will now have an very basic React application that only shows the component. Everything inside [lib](./src/lib) is published as a package.

I you want to add operations in GraphQL, define them in [lib/graphql](./src/lib/graphql). To generate types and hooks that you can conveniently use in your React application, run
the following command:

```shell
npm run gen-types
```

## Publishing

You don't need to publish your updated version of this package yourself, that's done through [GitLab CI](../.gitlab/ci/ship.yaml).
Just [bump the version number](https://docs.npmjs.com/cli/v8/commands/npm-version) and you're good to go.