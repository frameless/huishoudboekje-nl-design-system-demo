// cypress/support/step_definitions/Generic/generic-tests.js

import { BeforeStep, Before } from "@badeball/cypress-cucumber-preprocessor";

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
before(() => {

// Clean up
  // Truncate alarms
  cy.request({
    method: "post",
    url: Cypress.env().graphqlUrl + '/graphql',
    body: { query: queryTruncateAlarm },
  }).then((res) => {
    console.log(res.body);
  });

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
BeforeStep(() => {

  // Log in
  cy.visit('/');
  cy.wait(500);
  cy.get('body').then(($body) => {
    const buttonLogin = $body.find('button[type="submit"]')
    if (buttonLogin.length) {
      cy.get('button').contains('Inloggen').click()
      cy.loginToAAD(Cypress.env('aad_username'), Cypress.env('aad_password'))
    }
    else {
      // already logged in; do nothing
    }

  })

});
