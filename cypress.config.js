const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin, } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin, } = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const { Client } = require('pg');
const fs = require('fs');

async function setupNodeEvents(on, config) {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    })
  );

  // This task performs a database query
  on("task", {
      dbQuery:(query)=> require("cypress-postgres-10v-compatibility")(query.query,query.connection)
  });

  // This task returns an array of files in a specified folder
  on('task', {
    filesInDownload (folderName) {
      return fs.readdirSync(folderName)
    }
  })

  // This task removes a specified folder and all contents, then creates said folder anew
  on('task', {
    resetFolder(folder) {
      // Delete the directory and recreate it
      fs.rmdirSync(folder, { recursive: true });
      fs.mkdirSync(folder);
      console.log('Removed and readded ' + folder + ' folder');
      return null
    },
  })



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
    // Extra
    experimentalRunAllSpecs: true,
    downloadsFolder: "cypress/downloads",

    // Host Url
    baseUrl: "http://localhost:3000",

    // Azure AD
    experimentalModifyObstructiveThirdPartyCode: true,

    // Output
    reporter: require.resolve("@badeball/cypress-cucumber-preprocessor/pretty-reporter"),

    specPattern: ["**/*.feature"],
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
    setupNodeEvents,
  },
});
