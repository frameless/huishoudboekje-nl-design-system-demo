// cypress/support/step_definitions/Alarms/create-alarm.js

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

//#region Scenario: view create alarm form with default options

When('I view the "Add alarm" modal', () => {
 
  // Click button element
  cy.visit('/afspraken/1');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/afspraken/1')
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.get('button')
    .contains('Toevoegen')
    .click()
  
});

Then('the "Create alarm form" is displayed', () => {
 
  // Click button element
  cy.visit('/afspraken/1');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/afspraken/1')
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.get('button')
    .contains('Toevoegen')
    .click()
  
  // Check whether modal is opened and visible
  cy.get('section[aria-modal="true"]')
    .scrollIntoView()
    .should('be.visible')
  
});

Then('the recurrency is monthly', () => {
 
  // Click button element
  cy.visit('/afspraken/1');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/afspraken/1')
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.get('button')
    .contains('Toevoegen')
    .click()
  cy.waitForReact(); // Wait 0.5 seconds for modal opening
  
  // Check whether modal is opened and visible
  cy.get('section[aria-modal="true"]')
    .scrollIntoView()
    .should('be.visible')

  // Check recurrency
  cy.contains('Elke maand')
  
});

Then('the link "Meer opties" is displayed', () => {
 
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

  // Check link 'Meer opties'
  cy.get('button')
    .contains('Meer opties')
  
});

Then('the start date is today', () => {
 
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

  // Set date constants for comparison
  const dateNow = new Date().toLocaleDateString('nl-NL', {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  // Check date field
  cy.get('\#field\\-\\\:r15\\\:')
    .should('have.value', dateNow)

});

Then('the day of the month is empty', () => {

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

  // Check date field  
  cy.get('\#field\\-\\\:r17\\\:')
    .should('have.value', '')

});

Then('the allowed deviation in days is empty', () => {
 
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

  // Check date field  
  cy.get('\#field\\-\\\:r19\\\:')
    .should('have.value', '')

});

Then('the expected amount is equal to the amount of the agreement', () => {
  
  let agreementValue;

  // Click button element
  cy.visit('/afspraken/1');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/afspraken/1')
  cy.get('label[class^="chakra-form__label"]').contains('Bedrag')
    .siblings()
    .then(($value) => {
      agreementValue = $value.text() // Store the agreement amount in a variable
      const newValue1 = agreementValue.slice(2) // Remove the valuta symbol from string
      const newValue2 = newValue1.replace(",", ".") // Replace the comma with a full stop
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

  // Check expected payment-field  
  cy.get('\#field\\-\\\:r1b\\\:')
    .invoke('val')
    .should((val2) => {
      expect(val2).to.eq(newValue2)
    })
  })

});

Then('the allowed deviation in amount is empty', () => {
 
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

  // Check date field  
  cy.get('\#field\\-\\\:r1d\\\:')
    .should('have.value', '')

});

Then('the "Cancel" button is displayed', () => {
 
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

  // Check whether 'Annuleren' button exists
  cy.get('button')
    .contains('Annuleren')

});

Then('the "Submit form" button is displayed', () => {
 
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

  // Check whether 'Opslaan' button exists
  cy.waitForReact()
  cy.get('div[data-focus-lock-disabled="false"]').contains("Opslaan")
    .click()

});

Then('the "Close modal" button is displayed', () => {

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

  // Check whether the 'X' button exists in the top right
  cy.get('.chakra-modal__close-btn')

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
  cy.get('[aria-label="Bekijken"]:visible')
    .click()
  cy.url().should('contains', Cypress.config().baseUrl + '/afspraken/')
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  
});

When('I click the "Add alarm" button', () => {
 
  // Click button element
  cy.visit('/afspraken/1');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/afspraken/1')
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.get('button')
    .contains('Toevoegen')
    .click()

});

Then('a modal opens', () => {
 
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
 
});

// Then('I fill in the current date for alarm start date')
  // Is part of Scenario 'view create alarm form with default options' in create-alarm.js

Then('I fill in the current date for alarm start date', () => {
 
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

  // Set date constants for comparison
  const dateNow = new Date().toLocaleDateString('nl-NL', {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  // Check 'Startdatum' field
  cy.get('\#field\\-\\\:r15\\\:')
    .should('have.value', dateNow)
    .clear()
    .should('have.value', '')

  // Fill in 'Startdatum' field
  cy.get('\#field\\-\\\:r15\\\:')
    .type(dateNow)
    .should('have.value', dateNow)

});

Then('I fill in the alarm day of the month', () => {
 
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

  // Check 'Dag in de maand' field
  cy.get('\#field\\-\\\:r17\\\:')
    .should('have.value', '')

  // Fill in 'Dag in de maand' field
  cy.get('\#field\\-\\\:r17\\\:')
    .type('1')
    .should('have.value', '1')

});

Then('I fill in the alarm allowed deviation in days', () => {
 
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

  // Check 'Toegestane afwijking' field
  cy.get('\#field\\-\\\:r19\\\:')
    .should('have.value', '')

  // Fill in 'Toegestane afwijking' field
  cy.get('\#field\\-\\\:r19\\\:')
    .type('1')
    .should('have.value', '1')

});

Then('I fill in the expected payment amount', () => {
 
  let agreementValue;
  
  // Click button element
  cy.visit('/afspraken/1');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/afspraken/1')
  cy.get('label[class^="chakra-form__label"]').contains('Bedrag')
    .siblings()
    .then(($value) => {
      agreementValue = $value.text() // Store the agreement amount in a variable
      const newValue1 = agreementValue.slice(2) // Remove the valuta symbol from string
      const newValue2 = newValue1.replace(",", ".") // Replace the comma with a full stop
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

    // Check expected amount-field  
    cy.get('\#field\\-\\\:r1b\\\:')
      .invoke('val')
      .then((val2) => {
        expect(val2).to.eq(newValue2)

      // Clear and refill expected amount-field
      cy.get('\#field\\-\\\:r1b\\\:')
        .type('{selectAll}' + newValue2) // Done via 'selectAll', as a clear() will automatically leave a zero
        .should('have.value', newValue2)
        })
    })
});

Then('I fill in the alarm allowed deviation in payment amount', () => {
 
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

  // Check 'Toegestane afwijking bedrag' field
  cy.get('\#field\\-\\\:r1d\\\:')
    .should('have.value', '')

  // Fill in 'Toegestane afwijking bedrag' field
  cy.get('\#field\\-\\\:r1d\\\:')
    .type('1')
    .should('have.value', '1')

});

Then('I click the "Submit form" button', () => {
 
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

  // Wait for modal to close
  cy.waitForReact();
  
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

Then('the modal is closed', () => {

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
  cy.get('section[aria-modal="true"]')
    .should('not.exist')

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

Then('a notification of success is displayed', () => {
 
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
  cy.get('section[aria-modal="true"]')
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

Then('the current status of the alarm on the agreements page is displayed', () => {
 
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
  cy.get('section[aria-modal="true"]')
    .should('not.exist')

  // Check success message
  cy.get('[data-status="success"]')
    .should('be.visible')
  cy.contains('Het alarm is opgeslagen')

  // Check current status of alarm
  cy.get('.chakra-switch__track')
  cy.get('.chakra-switch__thumb')
  cy.get('[data-checked=""]')

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

