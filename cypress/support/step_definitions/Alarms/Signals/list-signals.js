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
 
//#endregion

//#region Scenario: active signals exist

Given('1 or more active signals exist', () => {

  Step(this, 'an agreement exists for scenario "no transaction within timeframe"');
  
  Step(this, 'an alarm exists for scenario "no transaction within timeframe"');
  
  Step(this, 'the alarm timeframe expires');
 
  Step(this, 'a "Payment missing" signal is created');

  cy.wait(10000);

});
 
// When('I view the "Signals" page', () => {});
  // Part of previous scenario

Then('the signal description is displayed', () => {

  // Assertion
  cy.contains('geen transactie gevonden');
  cy.contains('Dingus Bingus');

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

Then('the "Suppress signal" switch track is displayed', () => {

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
  cy.contains('geen transactie gevonden');
  cy.contains('Dingus Bingus');

  cy.get('[data-test="signal.badgeActive"]')
    .should('be.visible')
  cy.contains('Uitgeschakeld');

});

//#endregion
