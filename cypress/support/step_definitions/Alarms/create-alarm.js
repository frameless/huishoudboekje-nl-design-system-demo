// cypress/support/step_definitions/Alarms/create-alarm.js

import {Given, When, Then, Step} from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region Scenario: view create alarm form with default options

When('I view the "Add alarm" modal', () => {

  // Click button element
  cy.visit('/burgers/1');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers/1')

  // Open first agreement
  cy.get('tbody')
    .find('tr')
    .first()
    .children()
    .last()
    .find('a[aria-label="Bekijken"]:visible')
    .click();

  cy.waitForReact();
  cy.url().should('include', Cypress.config().baseUrl + '/afspraken/')
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.get('button')
    .contains('Toevoegen')
    .click();

  cy.waitForReact(); // Wait for modal opening

});

Then('the "Create alarm form" is displayed', () => {

  // Check whether modal is opened and visible
  cy.get('section[aria-modal="true"]')
    .scrollIntoView()
    .should('exist');

});

Then('the recurrency is monthly', () => {

  // Check recurrency
  cy.contains('Elke maand')

});

Then('the start date is today', () => {

  // Set date constants for comparison
  const dateNow = new Date().toLocaleDateString('nl-NL', {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  // Check 'Startdatum' field
  cy.get('[data-test="alarmForm.startDate"]')
    .should('have.value', dateNow)

});

Then('the day of the month is empty', () => {

  // Check 'Dag in de maand' field  
  cy.get('[data-test="alarmForm.byMonthDay"]')
    .should('have.value', '')

});

Then('the allowed deviation in days is empty', () => {

  // Check 'Toegestane afwijking (in dagen)' field  
  cy.get('[data-test="alarmForm.dateMargin"]')
    .should('have.value', '')

});

Then('the expected amount is equal to the amount of the agreement', () => {

  let agreementValue;

  cy.get('label[class^="chakra-form__label"]').contains('Bedrag')
    .siblings()
    .then(($value) => {
      agreementValue = $value.text() // Store the agreement amount in a variable
      const newValue1 = agreementValue.slice(2) // Remove the valuta symbol from string
      const newValue2 = newValue1.replace(",", ".") // Replace the comma with a full stop

      // Check 'Bedrag verwachte betaling' field  
      cy.get('[data-test="alarmForm.amount"]')
        .invoke('val')
        .should((val2) => {
          expect(val2).to.eq(newValue2)
        })
    })

});

Then('the allowed deviation in amount is empty', () => {

  // Check 'Toegestane afwijking bedrag (in euro's)' field  
  cy.get('[data-test="alarmForm.amountMargin"]')
    .should('have.value', '')

});

Then('the "Submit form" button is displayed', () => {

  // Check whether 'Opslaan' button exists
  cy.get('[data-test="buttonModal.submit"]')
    .click()

});

Then('the "Close modal" button is displayed', () => {

  // Check whether the 'X' button exists in the top right
  cy.get('button[aria-label="Close"]')
    .should('be.visible');

});

//#endregion

//#region Scenario: save monthly alarm with basic options

When('I view the "Agreement" page', () => {

  // Navigate to /burgers
  cy.visit('/');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/huishoudens')
  cy.get('[href="/burgers"]')
    .click()
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')

  // Navigate to first displayed cilivian's detail page
  cy.contains('HHB000001')
    .click()
  cy.url().should('contains', Cypress.config().baseUrl + '/burgers/')

  // Navigate to first displayed agreement's detail page
  cy.get('tbody')
    .find('tr')
    .first()
    .children()
    .last()
    .find('a[aria-label="Bekijken"]:visible')
    .click();
  cy.url().should('contains', Cypress.config().baseUrl + '/afspraken/')
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view

});

Then('I fill in the current date for alarm start date', () => {

  // Set date constants for comparison
  const dateNow = new Date().toLocaleDateString('nl-NL', {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  // Check 'Startdatum' field
  cy.get('[data-test="alarmForm.startDate"]')
    .clear()
    .should('have.value', '')

  // Fill in 'Startdatum' field
  cy.get('[data-test="alarmForm.startDate"]')
    .type(dateNow + '{enter}')
    .should('have.value', dateNow)

});

Then('I fill {string} into the alarm day of the month field', (alarmDay) => {

  // Check 'Dag in de maand' field  
  cy.get('[data-test="alarmForm.byMonthDay"]')
    .should('have.value', '')

  // Fill in 'Dag in de maand' field
  cy.get('[data-test="alarmForm.byMonthDay"]')
    .type(alarmDay)
    .should('have.value', alarmDay)

});

Then('I fill {string} into the alarm allowed deviation in days field', (deviationDay) => {

  // Check 'Toegestane afwijking (in dagen)' field  
  cy.get('[data-test="alarmForm.dateMargin"]')
    .should('have.value', '')

  // Fill in 'Toegestane afwijking (in dagen)' field  
  cy.get('[data-test="alarmForm.dateMargin"]')
    .type(deviationDay)
    .should('have.value', deviationDay)

});

Then('I fill in the expected payment amount', () => {

  let agreementValue;

  cy.get('label[class^="chakra-form__label"]').contains('Bedrag')
    .siblings()
    .then(($value) => {
      agreementValue = $value.text() // Store the agreement amount in a variable
      const newValue1 = agreementValue.slice(2) // Remove the valuta symbol from string
      const newValue2 = newValue1.replace(",", ".") // Replace the comma with a full stop

      // Check 'Bedrag verwachte betaling' field   
      cy.get('[data-test="alarmForm.amount"]')
        .invoke('val')
        .then((val2) => {
          expect(val2).to.eq(newValue2)

          // Clear and refill 'Bedrag verwachte betaling' field   
          cy.get('[data-test="alarmForm.amount"]')
            .type('{selectAll}' + newValue2) // Done via 'selectAll', as a clear() will automatically leave a zero
            .should('have.value', newValue2)
        })
    })
});

Then('I fill {string} into the alarm allowed deviation in payment amount field', (deviationPayment) => {

  // Check 'Toegestane afwijking bedrag (in euro's)' field  
  cy.get('[data-test="alarmForm.amountMargin"]')
    .should('have.value', '')

  // Fill in 'Toegestane afwijking bedrag (in euro's)' field  
  cy.get('[data-test="alarmForm.amountMargin"]')
    .type(deviationPayment)
    .should('have.value', deviationPayment)

});

Then('I click the "Submit form" button', () => {

  // Click 'Opslaan' button
  cy.waitForReact()
  cy.get('[data-test="buttonModal.submit"]')
    .click()

  // Wait for modal to close
  cy.waitForReact();

});

Then('the "Create alarm form" modal is closed', () => {

  // Check whether modal is closed
  cy.contains('Alarm toevoegen')
    .should('not.exist')
  cy.get('section[aria-modal="true"]')
    .should('not.exist')

});

Then('a notification of success is displayed', () => {

  // Check success message
  cy.get('[data-status="success"]')
    .should('be.visible')

});

Then('the current status of the alarm on the agreements page is displayed', () => {

  // Check current status of alarm
  cy.get('.chakra-switch__track')
  cy.get('.chakra-switch__thumb')
  cy.get('[data-checked=""]')

});

//#endregion

