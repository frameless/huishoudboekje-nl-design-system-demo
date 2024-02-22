// cypress/support/step_definitions/Signals/create-signal-on-no-payment.js

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

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

const queryAddAlarm = `mutation CreateAlarm {
  createAlarm(input: {alarm:{
    afspraakId: 1,
    id: "test",
    isActive: false,
    datumMargin: 20,
    bedrag: 1230,
    bedragMargin: 5,
    startDate: "01-01-2024"
  }})
  {
    alarm{
      id
    }
   }
  }`

//#region Scenario: no transaction within timeframe

When('the alarm timeframe expires', () => {

  // Add alarm to database

    // Run query
    cy.request({
      method: "post",
      url: Cypress.config().graphqlUrl + '/graphql',
      body: { query: queryAddAlarm },
    }).then((res) => {
      console.log(res.body);
    });

  // Run command to trigger alarm
    // [TO-DO] Will be done by alarmservice in new version

  // Check whether notification is set
    // [TO-DO] Will be done by alarmservice in new version

  // Clean up
    // Truncate alarms
    cy.request({
      method: "post",
      url: Cypress.config().graphqlUrl + '/graphql',
      body: { query: queryTruncateAlarm },
    }).then((res) => {
      console.log(res.body);
    });

    // Truncate signals
    cy.request({
      method: "post",
      url: Cypress.config().graphqlUrl + '/graphql',
      body: { query: queryTruncateSignal },
    }).then((res) => {
      console.log(res.body);
    });
 
});
 
Then('a "Payment missing" signal is created', () => {
  
  // Add alarm to database

    // Run query
    cy.request({
      method: "post",
      url: Cypress.config().graphqlUrl + '/graphql',
      body: { query: queryAddAlarm },
    }).then((res) => {
      console.log(res.body);
    });

  // Run command to trigger alarm
    // [TO-DO] Will be done by alarmservice in new version

  // Check whether notification is set
    // [TO-DO] Will be done by alarmservice in new version

  // Clean up
    // Truncate alarms
    cy.request({
      method: "post",
      url: Cypress.config().graphqlUrl + '/graphql',
      body: { query: queryTruncateAlarm },
    }).then((res) => {
      console.log(res.body);
    });

    // Truncate signals
    cy.request({
      method: "post",
      url: Cypress.config().graphqlUrl + '/graphql',
      body: { query: queryTruncateSignal },
    }).then((res) => {
      console.log(res.body);
    });
 
});

//#endregion
