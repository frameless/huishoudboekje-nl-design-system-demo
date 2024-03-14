// cypress/support/step_definitions/Generic/generic-tests.js

import { BeforeStep, Before, After } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

// Set database query
const queryTruncateAlarm = `mutation Truncate {
  truncateTable(databaseName: "alarmenservice", tableName: "Alarm")
}`

const queryTruncateSignal = `mutation Truncate {
  truncateTable(databaseName: "signalenservice", tableName: "Signal")
}`

// Before *all* tests, run this (so this runs once at the start)
Before({ tags: "@alarmservice" }, function () {

// Clean up
  // Truncate alarms
  cy.request({
    method: "post",
    url: Cypress.env().graphqlUrl + '/graphql',
    body: { query: queryTruncateAlarm },
  }).then((res) => {
    console.log(res.body);
  });

});

Before({ tags: "@signalservice" }, function () {

  // Clean up
    // Truncate signals
    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateSignal },
    }).then((res) => {
      console.log(res.body);
    });
  
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

// Clean-up testdata after Scenario 'organisation and bank account are not used for reconciliation'
After({ tags: "@cleanupDepartment" }, function ()  {

  cy.get('[data-test="menuDepartment"]')
    .click();
  cy.get('[data-test="menuDepartment.delete"]')
    .click();
  cy.get('[data-test="modalDepartment.delete"]')
    .click();
  cy.waitForReact();

  // Check success message
  cy.get('[data-status="success"]')
    .should('be.visible')

});
