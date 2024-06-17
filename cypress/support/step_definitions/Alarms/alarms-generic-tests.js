// cypress/support/step_definitions/Generic/generic-tests.js

import { Before, After, When, Step } from "@badeball/cypress-cucumber-preprocessor";

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

// Unique names
const uniqueSeed = Date.now().toString();

After({ tags: "@afterCleanupAlarm" }, function (){

  // Clean up alarm
  cy.get('button[aria-label="Verwijderen"]')
    .click();
  cy.get('button[aria-label="Verwijderen"]')
    .click();

  // Check success message
  Step(this, "a success notification containing 'Het alarm is verwijderd' is displayed");

// Clean up
Step(this, 'I truncate the alarms table in alarmenservice');

});

Before({ tags: "@beforeCleanupAlarm" }, function (){

  // Clean up
  Step(this, 'I truncate the alarms table in alarmenservice');
  Step(this, 'I truncate the signals table in alarmenservice');

});

When('I create a test alarm', () => {
  
  // Truncate alarms
  Step(this, 'I truncate the alarms table in alarmenservice');

  // Navigate to test citizen's overview page
  Step(this, 'I open the citizen overview page for "Dingus Bingus"');

  // Navigate to last displayed agreement's detail page
  cy.get('tbody')
    .find('tr')
    .last()
    .children()
    .last()
    .find('a[aria-label="Bekijken"]:visible')
    .click();
  cy.url().should('contains', Cypress.config().baseUrl + '/afspraken/')
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.get('button')
    .contains('Toevoegen')
    .click();

  // Check whether modal is opened and visible
  cy.get('section[aria-modal="true"]', { timeout: 10000 })
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
      .type('{selectAll}13.37')
      .should('have.value', '13.37')

  // Click 'Opslaan' button
  cy.get('[data-test="buttonModal.submit"]', { timeout: 10000 })
    .click()

  // Check whether modal is closed
  cy.contains('Alarm toevoegen', { timeout: 10000 })
    .should('not.exist');
  cy.get('section[aria-modal="true"]', { timeout: 10000 })
    .should('not.exist');

});

Before({ order: 3, tags: "@beforeCreateAgreement" }, () => {
  
  // Clean up
  Step(this, 'I truncate the alarms table in alarmenservice');
  Step(this, 'I truncate the signals table in alarmenservice');

  // Navigate to test citizen's overview page
  Step(this, 'I open the citizen overview page for "Dingus Bingus"');
  Step(this, "I click the button 'Toevoegen'");

  // Add agreement with test department
  cy.url().should('contains', '/afspraken/toevoegen'); 
  cy.get('[data-test="radio.agreementOrganization"]')
    .click();
  cy.get('#organisatie')
    .type('Albert');
  cy.contains('Heijn')
    .click();
  // Check auto-fill
  cy.contains('Zaandam');
  // Fill in IBAN
  cy.get('#tegenrekening')
    .type('NL09');
  cy.contains('9532')
    .click();

  // Payment direction: Toeslagen
  cy.get('[data-test="radio.agreementIncome"]')
    .click();
  cy.get('#rubriek')
    .click()
    .contains('Inkomsten')
    .click();
  cy.get('[data-test="select.agreementIncomeDescription"]')
    .type(uniqueSeed);
  cy.get('[data-test="select.agreementIncomeAmount"]')
    .type('543.54');
  cy.get('[data-test="button.Submit"]')
    .click();

  // Check success message
  Step(this, "a success notification containing 'De afspraak is opgeslagen' is displayed");

});

// Set order to be after @afterCleanupAlarm
After({ tags: "@afterDeleteAgreement", order: 10 }, () => {
  
  // Navigate to test citizen's overview page
  Step(this, 'I open the citizen overview page for "Dingus Bingus"');
  
  // Navigate to last displayed agreement's detail page
  cy.get('tbody')
    .find('tr')
    .last()
    .children()
    .last()
    .find('a[aria-label="Bekijken"]:visible')
    .click();
  cy.url().should('contains', Cypress.config().baseUrl + '/afspraken/')

  cy.get('[data-test="agreement.menuKebab"]')
    .click();
  cy.get('[data-test="agreement.menuDelete"]')
    .click();
  cy.get('[data-test="button.AlertDelete"]')
    .click();

  // Check success message
  Step(this, "a success notification containing 'De afspraak is verwijderd' is displayed");

});

After({ tags: "@cleanupBankstatement" }, function (){

  // Clean up
  Step(this, 'I truncate the alarms table in alarmenservice');
  Step(this, 'I truncate the signals table in alarmenservice');
  Step(this, 'I truncate the bank transaction tables');

});