// cypress/support/step_definitions/Signals/list-signals.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

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

//#region Scenario: no signal exists

Given('0 active signals exist', () => {

 // Clean up
    // Truncate signals
    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateSignal },
    }).then((res) => {
      console.log(res.body);
    });

    // Truncate alarms
    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateAlarm },
    }).then((res) => {
      console.log(res.body);
    });

  cy.wait(3000);

});
 
When('I view the "Signals" page', () => {

  cy.visit('/signalen')
  cy.wait(500);
  cy.url().should('eq', Cypress.config().baseUrl + '/signalen')

});

Then('the "Er zijn geen signalen gevonden" text is displayed', () => {

  cy.contains('Er zijn geen signalen gevonden');

});

//#endregion

//#region Scenario: active signals exist

Given('1 or more active signals exist', () => {

  Step(this, 'an agreement exists for scenario "payment amount too high"');
  
  Step(this, 'an alarm exists for scenario "payment amount too high"');
  
  Step(this, 'a CAMT test file is created with a high payment amount');
  
  Step(this, 'a high amount bank transaction is booked to an agreement');
  
  Step(this, 'the bank transaction date is within the alarm timeframe');
  
  Step(this, 'the high amount bank transaction amount is greater than the sum of the expected amount plus the allowed amount deviation');
    
  Step(this, 'a "Payment amount too high" signal is created');

  cy.wait(3000);

});
 
// When('I view the "Signals" page', () => {});
  // Part of previous scenario

Then('the signal description is displayed', () => {

  // Assertion
  cy.contains('98,99');
  cy.contains('Mcpherson Patterson');
  cy.contains('108.99');

});

Then('the signal date is displayed', () => {
  
  // Create specific date display for assertion
  const d = new Date();
  let day = d.getUTCDate();

  const month = ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];
  let nameMonth = month[d.getMonth()];

  let year = d.getFullYear();
  
  // Assertion
  cy.contains(day + ' ' + nameMonth + ' ' + year);

});

Then('the "Suppress signal" button is displayed', () => {

  cy.get('[data-test="signal.switchActive"]')
    .should('be.visible');

});

Then('the signal status is displayed', () => {

  cy.get('[data-test="signal.badgeActive"]')
    .should('be.visible')
  cy.contains('Ingeschakeld');
  
});

//#endregion

//#region Scenario: suppressed signals exist

Given('1 or more suppressed signals exist', () => {

  cy.visit('/signalen')
  cy.wait(500);
  cy.url().should('eq', Cypress.config().baseUrl + '/signalen')

  // Suppress active signal from previous test
  cy.get('[data-test="signal.switchActive"]')
    .click();

  // Make sure signal has disappeared
  cy.get('[data-test="signal.badgeActive"]')
    .should('not.exist')

});
 
// When('I view the "Signals" page', () => {});
  // Part of previous scenario

Then('I enable the suppressed signals filter', () => {

  cy.get('[data-test="checkbox.signalInactive"]')
    .click();

});

Then('all suppressed signals are displayed', () => {

  // Assertion
  cy.contains('98,99');
  cy.contains('Mcpherson Patterson');
  cy.contains('108.99');

  cy.get('[data-test="signal.badgeActive"]')
    .should('be.visible')
  cy.contains('Uitgeschakeld');

});

//#endregion
