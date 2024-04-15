// cypress/support/step_definitions/Generic/generic-tests.js

import { BeforeStep, Before, After } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

// Set database query
const queryTruncateAlarm = `mutation Truncate {
  truncateTable(databaseName: "alarmenservice", tableName: "alarms")
}`

const queryTruncateSignal = `mutation Truncate {
  truncateTable(databaseName: "alarmenservice", tableName: "signals")
}`

// Before *all* tests, run this (so this runs once at the start)
Before({ tags: "@alarmservice" }, function () {

  // Wipe signals clean
  Step(this, 'I clean up "Signals" table');
  
  // Wipe alarms clean
  Step(this, 'I clean up "Alarms" table');

});

Before({ tags: "@signalservice" }, function () {

  // Wipe signals clean
  Step(this, 'I clean up "Signals" table');
  
  });

// Before *each* test, run this (so this runs equal to the amount of tests)
Before(function () {
  
  cy.getCookie('appSession').then((c) => {
    const cookie = c
    if(c) {
    // If there is a cookie, do this
    }
    else {
    // If no cookie, log in
      // Log in
      cy.visit('/');
      cy.wait(500);
      cy.get('body').then(($body) => {
        const buttonLogin = $body.find('button[type="submit"]')
        if (buttonLogin.length) {
          cy.get('[data-test="button.Login"]').click()
          //cy.get('button').contains('Inloggen').click()
          cy.loginToAAD(Cypress.env('aad_username'), Cypress.env('aad_password'))
        }
        else {
          // Already logged in; do nothing
        }

      })

    }

  })

});
