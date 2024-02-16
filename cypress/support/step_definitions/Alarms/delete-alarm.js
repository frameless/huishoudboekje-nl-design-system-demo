// cypress/support/step_definitions/Alarms/delete-alarm.js

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

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

//#region Scenario: delete alarm

// When('I view the "Agreement" page')
  // Is part of Scenario 'view create alarm form with default options' in create-alarm.js

When('I click the "Delete alarm" button', () => {
 
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')
    .scrollIntoView() // Scrolls modal footer into view
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
  cy.get('.css-r3jkky')
    .click()

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
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Alarm"`,"connection":connectionAlarm}).then(queryResponse => {
      cy.log(queryResponse)
    });

    // Truncate signals
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Signal"`,"connection":connectionSignal}).then(queryResponse => {
      cy.log(queryResponse)
    });
  
});

Then('the "Cancel delete alarm" button is displayed', () => {
 
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')
    .scrollIntoView() // Scrolls modal footer into view
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
  cy.get('.css-r3jkky')
    .click()

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
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Alarm"`,"connection":connectionAlarm}).then(queryResponse => {
      cy.log(queryResponse)
    });

    // Truncate signals
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Signal"`,"connection":connectionSignal}).then(queryResponse => {
      cy.log(queryResponse)
    });
  
});

Then('the "Confirm delete alarm" button is displayed', () => {
 
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')
    .scrollIntoView() // Scrolls modal footer into view
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
  cy.get('.css-r3jkky')
    .click()

  // Check whether modal is closed
  cy.contains('Alarm toevoegen')
    .should('not.exist')
  cy.get('.chakra-modal__footer')
    .should('not.exist')

  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Verwijderen"]')
    .should('be.visible')

  // Clean up
    // Truncate alarms
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Alarm"`,"connection":connectionAlarm}).then(queryResponse => {
      cy.log(queryResponse)
    });

    // Truncate signals
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Signal"`,"connection":connectionSignal}).then(queryResponse => {
      cy.log(queryResponse)
    });
  
});

//#endregion

//#region Scenario: cancel delete alarm

When('I click the "Cancel delete alarm" button', () => {
 
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')
    .scrollIntoView() // Scrolls modal footer into view
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
  cy.get('.css-r3jkky')
    .click()

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
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Alarm"`,"connection":connectionAlarm}).then(queryResponse => {
      cy.log(queryResponse)
    });

    // Truncate signals
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Signal"`,"connection":connectionSignal}).then(queryResponse => {
      cy.log(queryResponse)
    });
  
});

Then('the "Delete alarm" button is displayed', () => {
 
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')
    .scrollIntoView() // Scrolls modal footer into view
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
  cy.get('.css-r3jkky')
    .click()

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
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Alarm"`,"connection":connectionAlarm}).then(queryResponse => {
      cy.log(queryResponse)
    });

    // Truncate signals
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Signal"`,"connection":connectionSignal}).then(queryResponse => {
      cy.log(queryResponse)
    });
  
});

//#endregion

//#region Scenario: confirm delete alarm

When('I click the "Confirm delete alarm" button', () => {
 
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')
    .scrollIntoView() // Scrolls modal footer into view
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
  cy.get('.css-r3jkky')
    .click()

  // Check whether modal is closed
  cy.contains('Alarm toevoegen')
    .should('not.exist')
  cy.get('.chakra-modal__footer')
    .should('not.exist')

  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Verwijderen"]')
    .click()

  // Clean up
    // Truncate alarms
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Alarm"`,"connection":connectionAlarm}).then(queryResponse => {
      cy.log(queryResponse)
    });

    // Truncate signals
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Signal"`,"connection":connectionSignal}).then(queryResponse => {
      cy.log(queryResponse)
    });
  
});

// Then('a notification of success is displayed', () => {}
  // This test can be found in /Alarms/set-alarm

Then('the "Er is geen alarm ingesteld." text is displayed', () => {
 
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')
    .scrollIntoView() // Scrolls modal footer into view
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
  cy.get('.css-r3jkky')
    .click()

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

  // Clean up
    // Truncate alarms
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Alarm"`,"connection":connectionAlarm}).then(queryResponse => {
      cy.log(queryResponse)
    });

    // Truncate signals
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Signal"`,"connection":connectionSignal}).then(queryResponse => {
      cy.log(queryResponse)
    });
  
});

Then('the "Add alarm" button is displayed', () => {
 
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')
    .scrollIntoView() // Scrolls modal footer into view
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
  cy.get('.css-r3jkky')
    .click()

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

  // Clean up
    // Truncate alarms
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Alarm"`,"connection":connectionAlarm}).then(queryResponse => {
      cy.log(queryResponse)
    });

    // Truncate signals
    cy.task("dbQuery", {"query":`TRUNCATE TABLE public."Signal"`,"connection":connectionSignal}).then(queryResponse => {
      cy.log(queryResponse)
    });
  
});

//#endregion