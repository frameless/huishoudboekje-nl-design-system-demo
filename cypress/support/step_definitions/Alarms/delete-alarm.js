// cypress/support/step_definitions/Alarms/delete-alarm.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region Scenario: view delete alarm form

// Given('I view the "Agreement" page')
  // Is part of Scenario 'view create alarm form with default options' in create-alarm.js

When('I click the "Delete alarm" button', () => {
  
  // Create an alarm
  Step(this, 'I create a test alarm');

  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  
});

Then('the "Cancel delete alarm" button is displayed', () => {
 
  // Check assertion
  cy.get('button[aria-label="Annuleren"]')
    .should('be.visible')

  
});

Then('the "Confirm delete alarm" button is displayed', () => {
 
  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .should('be.visible')
    
});

//#endregion

//#region Scenario: cancel alarm deletion

When('I click the "Cancel delete alarm" button', () => {
 
  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Annuleren"]')
    .click()
  
});

Then('the "Delete alarm" button is displayed', () => {
 
  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .should('be.visible')
    cy.get('button[aria-label="Annuleren"]')
    .should('not.exist')

});

//#endregion

//#region Scenario: confirm alarm deletion

When('I click the "Confirm delete alarm" button', () => {
 
  // Wait for back-end to catch up to front-end
  cy.wait(500);

  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Verwijderen"]')
    .click()

});

// Then('a notification of success is displayed', () => {}
  // This test can be found in /Alarms/create-alarm

Then('the "Er is geen alarm ingesteld." text is displayed', () => {
 
  // Check assertion
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.contains('Er is geen alarm ingesteld.')
  
});

Then('the "Add alarm" button is displayed', () => {
 
  // Check assertion
  cy.get('button')
    .contains('Toevoegen');
  
});

//#endregion