// cypress/support/step_definitions/Alarms/read-alarm-settings.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region Scenario: no alarm exists

  //When('I view the "Agreement" page', () => {});
  // Is already defined in other test

  //Then('the "Er is geen alarm ingesteld." text is displayed', () => {
  // Is already defined in other test

  //Then('the "Add alarm" button is displayed', () => {
  // Is already defined in other test

//#endregion

//#region Scenario: monthly recurring alarm exists

  //When('I view the "Agreement" page', () => {});
  // Is already defined in other test

Then('the alarm recurrency is displayed', () => {
 
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

  // Check if recurrency is displayed
  cy.contains('Periodiek')

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

Then('the alarm day of the month is displayed', () => {

  Step(this, 'I view the "Add alarm" modal');

  // Fill in all required fields
    // 'Startdatum'
      // Is automatically filled in

    // 'Dag in de maand'
    cy.get('[data-test="alarmForm.byMonthDay"]')
      .type('16')
      .should('have.value', '16')

    // 'Toegestane afwijking (in dagen)'
    cy.get('[data-test="alarmForm.dateMargin"]')
      .type('1')
      .should('have.value', '1')

    // 'Bedrag verwachte betaling'
      // Is automatically filled in

    // 'Toegestane afwijking bedrag'
    cy.get('[data-test="alarmForm.amountMargin"]')
      .type('1')
      .should('have.value', '1') 

  // Click 'Opslaan' button
  cy.waitForReact()
  cy.get('[data-test="buttonModal.submit"]')
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

  // Check if day of month is displayed
  cy.contains('op de 16e')

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

Then('the alarm allowed deviation in days is displayed', () => {

  Step(this, 'I view the "Add alarm" modal');

  // Fill in all required fields
    // 'Startdatum'
      // Is automatically filled in

    // 'Dag in de maand'
    cy.get('[data-test="alarmForm.byMonthDay"]')
    .type('1')
    .should('have.value', '1')

    // 'Toegestane afwijking (in dagen)'
    cy.get('[data-test="alarmForm.dateMargin"]')
      .type('23')
      .should('have.value', '23')

    // 'Bedrag verwachte betaling'
      // Is automatically filled in

    // 'Toegestane afwijking bedrag'
    cy.get('[data-test="alarmForm.amountMargin"]')
      .type('1')
      .should('have.value', '1') 

  // Click 'Opslaan' button
  cy.waitForReact()
  cy.get('[data-test="buttonModal.submit"]')
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

  // Check if deviation is displayed
  cy.contains('+23 dagen')

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

Then('the alarm next date is displayed', () => {

  Step(this, 'I view the "Add alarm" modal');

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
      // Is automatically filled in

    // 'Toegestane afwijking bedrag'
    cy.get('[data-test="alarmForm.amountMargin"]')
      .type('1')
      .should('have.value', '1') 

  // Click 'Opslaan' button
  cy.waitForReact()
  cy.get('[data-test="buttonModal.submit"]')
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

  // Check if next date is displayed
  cy.contains('Eerstvolgende datum')
  cy.contains('01-01-2099')

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

Then('the alarm expected amount is displayed', () => {

  Step(this, 'I view the "Add alarm" modal');

  // Fill in all required fields
    // 'Startdatum'
      // Is automatically filled in

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
      .type('1')
      .should('have.value', '1') 

  // Click 'Opslaan' button
  cy.waitForReact()
  cy.get('[data-test="buttonModal.submit"]')
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

  // Check if expected amount is displayed
  cy.contains('Bedrag')
  cy.contains('123,45')

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

Then('the alarm allowed deviation of the expected amount is displayed', () => {

  Step(this, 'I view the "Add alarm" modal');

  // Fill in all required fields
    // 'Startdatum'
      // Is automatically filled in

    // 'Dag in de maand'
    cy.get('[data-test="alarmForm.byMonthDay"]')
    .type('1')
    .should('have.value', '1')

    // 'Toegestane afwijking (in dagen)'
    cy.get('[data-test="alarmForm.dateMargin"]')
      .type('1')
      .should('have.value', '1')

    // 'Bedrag verwachte betaling'
      // Is automatically filled in

    // 'Toegestane afwijking bedrag'
    cy.get('[data-test="alarmForm.amountMargin"]')
      .type('{selectAll}37')
      .should('have.value', '37')

  // Click 'Opslaan' button
  cy.waitForReact()
  cy.get('[data-test="buttonModal.submit"]')
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

  // Check if allowed deviation of the expected amount is displayed
  cy.contains('+/- € 37,00')

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

Then('the alarm status is displayed', () => {

  Step(this, 'I view the "Add alarm" modal');

  // Fill in all required fields
    // 'Startdatum'
      // Is automatically filled in

    // 'Dag in de maand'
    cy.get('[data-test="alarmForm.byMonthDay"]')
      .type('1')
      .should('have.value', '1')

    // 'Toegestane afwijking (in dagen)'
    cy.get('[data-test="alarmForm.dateMargin"]')
      .type('1')
      .should('have.value', '1')

    // 'Bedrag verwachte betaling'
      // Is automatically filled in

    // 'Toegestane afwijking bedrag'
    cy.get('[data-test="alarmForm.amountMargin"]')
      .type('1')
      .should('have.value', '1') 

  // Click 'Opslaan' button
  cy.waitForReact()
  cy.get('[data-test="buttonModal.submit"]')
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

  // Check whether current status of alarm is displayed
  cy.get('label[class^="chakra-switch"]')
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

//Then('the "Delete alarm" button is displayed', () => {
// Is already defined in other test

//#endregion