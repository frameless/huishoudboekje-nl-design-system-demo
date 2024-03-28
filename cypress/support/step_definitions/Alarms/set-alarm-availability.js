// cypress/support/step_definitions/Alarms/set-alarm-availability.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region Scenario: toggle alarm to disabled

  // Given('I view the "Agreement" page')
    // Already part of create-alarm.js

Then('the alarm availability is displayed', () => {

  Step(this, 'I create a test alarm');

  // Assert that the alarm availability is displayed
  cy.get('input[type="checkbox"]')
    .should('be.visible')

  // Check success message
  cy.get('[data-status="success"]')
    .should('be.visible')
  cy.contains('Het alarm is opgeslagen')
  
});

Then('the alarm availability is "Enabled"', () => {

  // Assert that the alarm availability is displayed
  cy.get('input[type="checkbox"]')
  cy.get('label[data-checked]')
    .should('be.visible')
  
});

When('I click the "Disable alarm" button', () => {

  // Assert that the alarm availability is displayed and click it
  cy.get('input[type="checkbox"]')
  cy.get('label[data-checked]')
    .should('be.visible')
    .click()
  cy.waitForReact()
  cy.get('input[type="checkbox"]')
    .should('be.visible')
  
});

Then('the alarm status is "Disabled"', () => {

  // Assert that the alarm is toggled to disabled after click
  cy.get('input[type="checkbox"]')
  cy.get('label[data-checked]')
    .should('not.exist')

  // Check success message
  cy.get('[data-status="success"]')
    .should('be.visible')
  cy.contains('Het alarm is uitgeschakeld')


  
});

//#endregion

//#region Scenario: toggle alarm to enabled

  // Given('I view the "Agreement" page')
    // Already part of create-alarm.js

  // Then('the alarm availability is displayed')
    // Already part of previous scenario in this file

  Then('the alarm availability is "Disabled"', () => {
   
    // Toggle the alarm to be disabled
    cy.get('input[type="checkbox"]')
    cy.get('label[data-checked]')
      .should('be.visible')
      .click()
    cy.waitForReact()

    // Assert that the alarm is disabled
    cy.get('input[type="checkbox"]')
    cy.get('label[data-checked]')
      .should('not.exist')
    
  });
  
  When('I click the "Enable alarm" button', () => {
  
    // Click the alarm toggle
    cy.get('label[class^="chakra-switch"]')
      .click()
    cy.waitForReact()
    cy.get('input[type="checkbox"]')
      .should('be.visible')
    
  });
  
  Then('the alarm status is "Enabled"', () => {
  
    // Assert that the alarm is toggled to enabled after click
    cy.get('input[type="checkbox"]')
    cy.get('label[data-checked]')
      .should('be.visible')
  
    // Check success message
    cy.get('[data-status="success"]')
      .should('be.visible')
    cy.contains('Het alarm is ingeschakeld')
    
  });
  
  //#endregion