// cypress/support/step_definitions/Alarms/set-alarm-availability.js

import { Given, When, Then, BeforeStep, Before, BeforeAll } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

// Set database connections
const connectionAlarm =
{
  "user": Cypress.config().databaseAlarmUser,
  "host": Cypress.config().databaseAlarmHost,
  "database": Cypress.config().databaseAlarm,
  "password": Cypress.config().databaseAlarmPassword,
  "port": Cypress.config().databasePort
};

const connectionSignal =
{
  "user": Cypress.config().databaseSignalUser,
  "host": Cypress.config().databaseSignalHost,
  "database": Cypress.config().databaseSignal,
  "password": Cypress.config().databaseSignalPassword,
  "port": Cypress.config().databasePort
};

//#region Scenario: toggle alarm to disabled

// Given('I view the "Agreement" page')
  // Already part of create-alarm.js

Then('the alarm availability is displayed', () => {

  // Click button element
  cy.visit('/afspraken/1');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/afspraken/1')
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.get('button')
    .contains('Toevoegen')
    .click()
  cy.wait(500) // Wait 0.5 seconds for modal opening

  // Check whether modal is opened and visible
  cy.get('section[aria-modal="true"]')
    .scrollIntoView()
    .should('be.visible')

  // Fill in all required fields
    // 'Startdatum'
      // Is automatically filled in

    // 'Dag in de maand'
    cy.get('\#field\\-\\\:r17\\\:')
    .type('1')
    .should('have.value', '1')

    // 'Toegestane afwijking'
    cy.get('\#field\\-\\\:r19\\\:')
      .type('1')
      .should('have.value', '1')

    // 'Bedrag verwachte betaling'
      // Is automatically filled in

    // 'Toegestane afwijking bedrag'
    cy.get('\#field\\-\\\:r1d\\\:')
      .type('1')
      .should('have.value', '1') 

  // Click 'Opslaan' button
  cy.waitForReact()
  cy.get('div[data-focus-lock-disabled="false"]').contains("Opslaan")
    .click()

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

  // Click button element
  cy.visit('/afspraken/1');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/afspraken/1')
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.get('button')
    .contains('Toevoegen')
    .click()
  cy.wait(500) // Wait 0.5 seconds for modal opening

  // Check whether modal is opened and visible
  cy.get('section[aria-modal="true"]')
    .scrollIntoView()
    .should('be.visible')

  // Fill in all required fields
    // 'Startdatum'
      // Is automatically filled in

    // 'Dag in de maand'
    cy.get('\#field\\-\\\:r17\\\:')
    .type('1')
    .should('have.value', '1')

    // 'Toegestane afwijking'
    cy.get('\#field\\-\\\:r19\\\:')
      .type('1')
      .should('have.value', '1')

    // 'Bedrag verwachte betaling'
      // Is automatically filled in

    // 'Toegestane afwijking bedrag'
    cy.get('\#field\\-\\\:r1d\\\:')
      .type('1')
      .should('have.value', '1') 

  // Click 'Opslaan' button
  cy.waitForReact()
  cy.get('div[data-focus-lock-disabled="false"]').contains("Opslaan")
    .click()

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

  // Click button element
  cy.visit('/afspraken/1');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/afspraken/1')
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.get('button')
    .contains('Toevoegen')
    .click()
  cy.wait(500) // Wait 0.5 seconds for modal opening

  // Check whether modal is opened and visible
  cy.get('section[aria-modal="true"]')
    .scrollIntoView()
    .should('be.visible')

  // Fill in all required fields
    // 'Startdatum'
      // Is automatically filled in

    // 'Dag in de maand'
    cy.get('\#field\\-\\\:r17\\\:')
    .type('1')
    .should('have.value', '1')

    // 'Toegestane afwijking'
    cy.get('\#field\\-\\\:r19\\\:')
      .type('1')
      .should('have.value', '1')

    // 'Bedrag verwachte betaling'
      // Is automatically filled in

    // 'Toegestane afwijking bedrag'
    cy.get('\#field\\-\\\:r1d\\\:')
      .type('1')
      .should('have.value', '1') 

  // Click 'Opslaan' button
  cy.waitForReact()
  cy.get('div[data-focus-lock-disabled="false"]').contains("Opslaan")
    .click()

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

  // Click button element
  cy.visit('/afspraken/1');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/afspraken/1')
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.get('button')
    .contains('Toevoegen')
    .click()
  cy.wait(500) // Wait 0.5 seconds for modal opening

  // Check whether modal is opened and visible
  cy.get('section[aria-modal="true"]')
    .scrollIntoView()
    .should('be.visible')

  // Fill in all required fields
    // 'Startdatum'
      // Is automatically filled in

    // 'Dag in de maand'
    cy.get('\#field\\-\\\:r17\\\:')
    .type('1')
    .should('have.value', '1')

    // 'Toegestane afwijking'
    cy.get('\#field\\-\\\:r19\\\:')
      .type('1')
      .should('have.value', '1')

    // 'Bedrag verwachte betaling'
      // Is automatically filled in

    // 'Toegestane afwijking bedrag'
    cy.get('\#field\\-\\\:r1d\\\:')
      .type('1')
      .should('have.value', '1') 

  // Click 'Opslaan' button
  cy.waitForReact()
  cy.get('div[data-focus-lock-disabled="false"]').contains("Opslaan")
    .click()

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
  
    // Click button element
    cy.visit('/afspraken/1');
    cy.waitForReact();
    cy.url().should('eq', Cypress.config().baseUrl + '/afspraken/1')
    cy.get('h2').contains('Alarm').should('be.visible')
      .scrollIntoView() // Scrolls 'Alarm' into view
    cy.get('button')
      .contains('Toevoegen')
      .click()
    cy.wait(500) // Wait 0.5 seconds for modal opening
  
    // Check whether modal is opened and visible
    cy.get('section[aria-modal="true"]')
      .scrollIntoView()
      .should('be.visible')
  
    // Fill in all required fields
      // 'Startdatum'
        // Is automatically filled in
  
      // 'Dag in de maand'
      cy.get('\#field\\-\\\:r17\\\:')
      .type('1')
      .should('have.value', '1')
  
      // 'Toegestane afwijking'
      cy.get('\#field\\-\\\:r19\\\:')
        .type('1')
        .should('have.value', '1')
  
      // 'Bedrag verwachte betaling'
        // Is automatically filled in
  
      // 'Toegestane afwijking bedrag'
      cy.get('\#field\\-\\\:r1d\\\:')
        .type('1')
        .should('have.value', '1') 
  
    // Click 'Opslaan' button
    cy.waitForReact()
  cy.get('div[data-focus-lock-disabled="false"]').contains("Opslaan")
    .click()
  
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
  
    // Click button element
    cy.visit('/afspraken/1');
    cy.waitForReact();
    cy.url().should('eq', Cypress.config().baseUrl + '/afspraken/1')
    cy.get('h2').contains('Alarm').should('be.visible')
      .scrollIntoView() // Scrolls 'Alarm' into view
    cy.get('button')
      .contains('Toevoegen')
      .click()
    cy.wait(500) // Wait 0.5 seconds for modal opening
  
    // Check whether modal is opened and visible
    cy.get('section[aria-modal="true"]')
      .scrollIntoView()
      .should('be.visible')
  
    // Fill in all required fields
      // 'Startdatum'
        // Is automatically filled in
  
      // 'Dag in de maand'
      cy.get('\#field\\-\\\:r17\\\:')
      .type('1')
      .should('have.value', '1')
  
      // 'Toegestane afwijking'
      cy.get('\#field\\-\\\:r19\\\:')
        .type('1')
        .should('have.value', '1')
  
      // 'Bedrag verwachte betaling'
        // Is automatically filled in
  
      // 'Toegestane afwijking bedrag'
      cy.get('\#field\\-\\\:r1d\\\:')
        .type('1')
        .should('have.value', '1') 
  
    // Click 'Opslaan' button
    cy.waitForReact()
  cy.get('div[data-focus-lock-disabled="false"]').contains("Opslaan")
    .click()
  
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
  
    // Click button element
    cy.visit('/afspraken/1');
    cy.waitForReact();
    cy.url().should('eq', Cypress.config().baseUrl + '/afspraken/1')
    cy.get('h2').contains('Alarm').should('be.visible')
      .scrollIntoView() // Scrolls 'Alarm' into view
    cy.get('button')
      .contains('Toevoegen')
      .click()
    cy.wait(500) // Wait 0.5 seconds for modal opening
  
    // Check whether modal is opened and visible
    cy.get('section[aria-modal="true"]')
      .scrollIntoView()
      .should('be.visible')
  
    // Fill in all required fields
      // 'Startdatum'
        // Is automatically filled in
  
      // 'Dag in de maand'
      cy.get('\#field\\-\\\:r17\\\:')
      .type('1')
      .should('have.value', '1')
  
      // 'Toegestane afwijking'
      cy.get('\#field\\-\\\:r19\\\:')
        .type('1')
        .should('have.value', '1')
  
      // 'Bedrag verwachte betaling'
        // Is automatically filled in
  
      // 'Toegestane afwijking bedrag'
      cy.get('\#field\\-\\\:r1d\\\:')
        .type('1')
        .should('have.value', '1') 
  
    // Click 'Opslaan' button
    cy.waitForReact()
    cy.get('div[data-focus-lock-disabled="false"]').contains("Opslaan")
      .click()
  
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