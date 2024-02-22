// cypress/support/step_definitions/Alarms/delete-alarm.js

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

  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()

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

  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Annuleren"]')
    .should('be.visible')

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

  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Verwijderen"]')
    .should('be.visible')

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

  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Annuleren"]')
    .click()

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

  // Check assertion
  cy.get('button[aria-label="Verwijderen"]')
    .click()
  cy.get('button[aria-label="Verwijderen"]')
    .click()

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