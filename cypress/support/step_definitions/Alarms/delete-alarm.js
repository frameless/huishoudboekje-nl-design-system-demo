// cypress/support/step_definitions/Alarms/delete-alarm.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

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

//#region Scenario: view delete alarm form

// When('I view the "Agreement" page')
  // Is part of Scenario 'view create alarm form with default options' in create-alarm.js

When('I click the "Delete alarm" button', () => {
 
  Step(this, 'I click the "Submit form" button');

  // Check whether modal is closed
  cy.contains('Alarm toevoegen')
    .should('not.exist')
  cy.get('.chakra-modal__footer')
    .should('not.exist')

  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()

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

Then('the "Cancel delete alarm" button is displayed', () => {
 
  Step(this, 'I click the "Submit form" button');

  // Check whether modal is closed
  cy.contains('Alarm toevoegen')
    .should('not.exist')
  cy.get('.chakra-modal__footer')
    .should('not.exist')

  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Annuleren"]')
    .should('be.visible')

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

Then('the "Confirm delete alarm" button is displayed', () => {
 
  Step(this, 'I click the "Submit form" button');

  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Verwijderen"]')
    .should('be.visible')
  
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

//#endregion

//#region Scenario: cancel alarm deletion

When('I click the "Cancel delete alarm" button', () => {
 
  Step(this, 'I click the "Submit form" button');

  // Check whether modal is closed
  cy.contains('Alarm toevoegen')
    .should('not.exist')
  cy.get('.chakra-modal__footer')
    .should('not.exist')

  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Annuleren"]')
    .click()

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

Then('the "Delete alarm" button is displayed', () => {
 
  Step(this, 'I click the "Submit form" button');

  // Check whether modal is closed
  cy.contains('Alarm toevoegen')
    .should('not.exist')
  cy.get('.chakra-modal__footer')
    .should('not.exist')

  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Annuleren"]')
    .click()
  cy.get('button[aria-label="Verwijderen"]')
    .should('be.visible')
    cy.get('button[aria-label="Annuleren"]')
    .should('not.exist')

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

//#endregion

//#region Scenario: confirm alarm deletion

When('I click the "Confirm delete alarm" button', () => {
 
  Step(this, 'I click the "Submit form" button');

  // Check whether modal is closed
  cy.contains('Alarm toevoegen')
    .should('not.exist')
  cy.get('.chakra-modal__footer')
    .should('not.exist')

  // Wait for back-end to catch up to front-end
  cy.wait(500);

  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Verwijderen"]')
    .click()

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

// Then('a notification of success is displayed', () => {}
  // This test can be found in /Alarms/create-alarm

Then('the "Er is geen alarm ingesteld." text is displayed', () => {
 
  Step(this, 'I click the "Submit form" button');

  // Check whether modal is closed
  cy.contains('Alarm toevoegen')
    .should('not.exist')
  cy.get('.chakra-modal__footer')
    .should('not.exist')

  // Delete alarm
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Verwijderen"]')
    .click()

  // Get success message
  cy.get('[data-status="success"]')
    .should('be.visible')
  cy.contains('Het alarm is verwijderd')

  // Check assertion
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.contains('Er is geen alarm ingesteld.')
  
});

Then('the "Add alarm" button is displayed', () => {
 
  Step(this, 'I click the "Submit form" button');

  // Check whether modal is closed
  cy.contains('Alarm toevoegen')
    .should('not.exist')
  cy.get('.chakra-modal__footer')
    .should('not.exist')

  // Delete alarm
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Verwijderen"]')
    .click()

  // Get success message
  cy.get('[data-status="success"]')
    .should('be.visible')
  cy.contains('Het alarm is verwijderd')

  // Check assertion
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.get('button').contains('Toevoegen');
  
});

//#endregion