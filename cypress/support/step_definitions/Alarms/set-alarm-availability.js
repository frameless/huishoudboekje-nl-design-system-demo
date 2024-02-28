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

  Step(this, 'I click the "Submit form" button');

  // Check whether modal is closed
  cy.contains('Alarm toevoegen')
    .should('not.exist')
  cy.get('.chakra-modal__footer')
    .should('not.exist')

  // Assert that the alarm availability is displayed
  cy.get('input[type="checkbox"]')
    .should('be.visible')

  // Check success message
  cy.get('[data-status="success"]')
    .should('be.visible')
  cy.contains('Het alarm is opgeslagen')

  // Clean up alarm
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  
  // Check success message
  cy.get('[data-status="success"]')
    .should('be.visible')
  cy.contains('Het alarm is verwijderd')
  
});

Then('the alarm availability is "Enabled"', () => {

  Step(this, 'I click the "Submit form" button');

  // Check whether modal is closed
  cy.contains('Alarm toevoegen')
    .should('not.exist')
  cy.get('.chakra-modal__footer')
    .should('not.exist')

  // Assert that the alarm availability is displayed
  cy.get('input[type="checkbox"]')
  cy.get('label[data-checked]')
    .should('be.visible')

  // Check success message
  cy.get('[data-status="success"]')
    .should('be.visible')
  cy.contains('Het alarm is opgeslagen')

  // Clean up alarm
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  
  // Check success message
  cy.get('[data-status="success"]')
    .should('be.visible')
  cy.contains('Het alarm is verwijderd')
  
});

When('I click the "Disable alarm" button', () => {

  Step(this, 'I click the "Submit form" button');

  // Check whether modal is closed
  cy.contains('Alarm toevoegen')
    .should('not.exist')
  cy.get('.chakra-modal__footer')
    .should('not.exist')

  // Assert that the alarm availability is displayed
  cy.get('input[type="checkbox"]')
  cy.get('label[data-checked]')
    .should('be.visible')
    .click()
  cy.waitForReact()
  cy.get('input[type="checkbox"]')
    .should('be.visible')

  // Check success message
  cy.get('[data-status="success"]')
    .should('be.visible')
  cy.contains('Het alarm is opgeslagen')

  // Clean up alarm
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  
  // Check success message
  cy.get('[data-status="success"]')
    .should('be.visible')
  cy.contains('Het alarm is verwijderd')
  
});

Then('the alarm status is "Disabled"', () => {

  Step(this, 'I click the "Submit form" button');

  // Check whether modal is closed
  cy.contains('Alarm toevoegen')
    .should('not.exist')
  cy.get('.chakra-modal__footer')
    .should('not.exist')

  // Assert that the alarm is toggled to disabled after click
  cy.get('input[type="checkbox"]')
  cy.get('label[data-checked]')
    .should('be.visible')
    .click()
  cy.waitForReact()
  cy.get('input[type="checkbox"]')
  cy.get('label[data-checked]')
    .should('not.exist')

  // Check success message
  cy.get('[data-status="success"]')
    .should('be.visible')
  cy.contains('Het alarm is opgeslagen')

  // Clean up alarm
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  
  // Check success message
  cy.get('[data-status="success"]')
    .should('be.visible')
  cy.contains('Het alarm is verwijderd')
  
});

//#endregion

//#region Scenario: toggle alarm to enabled

  // Given('I view the "Agreement" page')
    // Already part of create-alarm.js

  // Then('the alarm availability is displayed')
    // Already part of previous scenario in this file

  Then('the alarm availability is "Disabled"', () => {
  
    Step(this, 'I click the "Submit form" button');
  
    // Check whether modal is closed
    cy.contains('Alarm toevoegen')
      .should('not.exist')
    cy.get('.chakra-modal__footer')
      .should('not.exist')
    
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
  
    // Check success message
    cy.get('[data-status="success"]')
      .should('be.visible')
    cy.contains('Het alarm is opgeslagen')
  
    // Clean up alarm
    cy.get('button[aria-label="Verwijderen"]')
      .click()
    cy.get('button[aria-label="Verwijderen"]')
      .click()
    
    // Check success message
    cy.get('[data-status="success"]')
      .should('be.visible')
    cy.contains('Het alarm is verwijderd')
    
  });
  
  When('I click the "Enable alarm" button', () => {
  
    Step(this, 'I click the "Submit form" button');
  
    // Check whether modal is closed
    cy.contains('Alarm toevoegen')
      .should('not.exist')
    cy.get('.chakra-modal__footer')
      .should('not.exist')
  
    // Check success message
    cy.get('[data-status="success"]')
      .should('be.visible')
    cy.contains('Het alarm is opgeslagen')
      
    // Click the alarm toggle
    cy.get('label[data-checked]')
      .should('be.visible')
    cy.get('label[class^="chakra-switch"]')
      .click()
    cy.waitForReact()
    cy.get('input[type="checkbox"]')
      .should('be.visible')
  
    // Clean up alarm
    cy.get('button[aria-label="Verwijderen"]')
      .click()
    cy.get('button[aria-label="Verwijderen"]')
      .click()
    
    // Check success message
    cy.get('[data-status="success"]')
      .should('be.visible')
    cy.contains('Het alarm is verwijderd')
    
  });
  
  Then('the alarm status is "Enabled"', () => {
  
    Step(this, 'I click the "Submit form" button');
  
    // Check whether modal is closed
    cy.contains('Alarm toevoegen')
      .should('not.exist')
    cy.get('.chakra-modal__footer')
      .should('not.exist')
  
    // Assert that the alarm is toggled to disabled after click
    cy.get('input[type="checkbox"]')
    cy.get('label[data-checked]')
      .should('be.visible')
      .click()
    cy.waitForReact()
    cy.get('input[type="checkbox"]')
    cy.get('label[data-checked]')
      .should('not.exist')
  
    // Check success message
    cy.get('[data-status="success"]')
      .should('be.visible')
    cy.contains('Het alarm is opgeslagen')
  
    // Clean up alarm
    cy.get('button[aria-label="Verwijderen"]')
      .click()
    cy.get('button[aria-label="Verwijderen"]')
      .click()
    
    // Check success message
    cy.get('[data-status="success"]')
      .should('be.visible')
    cy.contains('Het alarm is verwijderd')
    
  });
  
  //#endregion