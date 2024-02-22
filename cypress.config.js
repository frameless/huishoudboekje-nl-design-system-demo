const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const { Client } = require('pg')

async function setupNodeEvents(on, config) {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  on("task", {
      dbQuery:(query)=> require("cypress-postgres-10v-compatibility")(query.query,query.connection)
  });

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

module.exports = defineConfig({
  projectId: 'ne2amu',
  video: false,
  screenshotOnRunFailure: false,
  env: {
    graphqlUrl: "http://localhost:4200",
    'cypress-react-selector': {
      root: '#root',
    },
  },
  e2e: {
    // Host Url
    baseUrl: "http://localhost:3000",

    // Database variables
      // Generic
      databasePort: 5432,

      // Alarmservice
      databaseAlarm: "alarmenservice",
      databaseAlarmUser:"postgres",
      databaseAlarmHost: "localhost",
      databaseAlarmPassword: "postgres",

      // Signalenservice
      databaseSignal: "signalenservice",
      databaseSignalUser:"postgres",
      databaseSignalHost: "localhost",
      databaseSignalPassword: "postgres",

    specPattern: ["**/*.feature"],
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
    setupNodeEvents,
  },
});

