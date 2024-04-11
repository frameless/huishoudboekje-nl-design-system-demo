// cypress/support/step_definitions/Generic/generic-tests.js

import { Before, After, When } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

// Set database query
const queryTruncateAlarm = `mutation Truncate {
  truncateTable(databaseName: "alarmenservice", tableName: "Alarm")
}`

const queryTruncateSignal = `mutation Truncate {
  truncateTable(databaseName: "alarmenservice", tableName: "signals")
}`

// Before *all* tests, run this (so this runs once at the start)
After({ tags: "@cleanupAlarm" }, function (){

  // Clean up alarm
  cy.get('button[aria-label="Verwijderen"]')
    .click();
  cy.get('button[aria-label="Verwijderen"]')
    .click();

  // Check success message
  cy.get('[data-status="success"]')
    .should('be.visible');
  cy.contains('Het alarm is verwijderd');

  // Clean up
    // Truncate alarms
    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateAlarm },
    }).then((res) => {
      console.log(res.body);
    });

});

When('I create a test alarm', () => {
  
  // Wipe alarms clean
    // Truncate alarms
    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateAlarm },
    }).then((res) => {
      console.log(res.body);
    });

  cy.wait(1000);

  // Click button element
  cy.visit('/burgers/1');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers/1')
  cy.get('a[aria-label="Bekijken"]:visible')
    .click();
  cy.waitForReact();
  cy.url().should('include', Cypress.config().baseUrl + '/afspraken/')
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.get('button')
    .contains('Toevoegen')
    .click();

  cy.waitForReact(); // Wait for modal opening

  // Check whether modal is opened and visible
  cy.get('section[aria-modal="true"]')
    .scrollIntoView()
    .should('exist');
  
  // Fill in all required fields
    // 'Startdatum'
      // Set date constants for comparison
      const dateNow = new Date().toLocaleDateString('nl-NL', {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })

    cy.get('[data-test="alarmForm.startDate"]')
      .should('have.value', dateNow)
      .type('{selectAll}01-01-2099{enter}')

    // 'Dag in de maand'
    cy.get('[data-test="alarmForm.byMonthDay"]')
      .type('1')
      .should('have.value', '1')

    // 'Toegestane afwijking (in dagen)'
    cy.get('[data-test="alarmForm.dateMargin"]')
      .type('1')
      .should('have.value', '1')

    // 'Bedrag verwachte betaling'
    cy.get('[data-test="alarmForm.amount"]')
      .type('{selectAll}123.45')
      .should('have.value', '123.45') 

    // 'Toegestane afwijking bedrag'
    cy.get('[data-test="alarmForm.amountMargin"]')
      .type('{selectAll}37')
      .should('have.value', '37')

  // Click 'Opslaan' button
  cy.waitForReact()
  cy.get('[data-test="buttonModal.submit"]')
    .click()

  // Wait for modal to close
  cy.waitForReact();

  // Check whether modal is closed
  cy.contains('Alarm toevoegen')
    .should('not.exist');
  cy.get('section[aria-modal="true"]')
    .should('not.exist');

});