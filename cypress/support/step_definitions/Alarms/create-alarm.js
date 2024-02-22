// cypress/support/step_definitions/Alarms/create-alarm.js

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
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
  cy.get('.chakra-modal__footer')
    .scrollIntoView() // Scrolls 'footer' into view
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')

  // Check recurrency
  cy.get('.css-1y3f6ad > :nth-child(1) > .chakra-text')
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')

  // Check link 'Meer opties'
  cy.get('.css-1jjjd9b > .css-1y3f6ad > :nth-child(2) > .chakra-button')
  cy.contains('Meer opties')
  
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')

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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')

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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')

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
  cy.get(':nth-child(3) > .css-1loywkv > div.css-0 > .css-8g8ihq > :nth-child(2) > .chakra-stack > .chakra-text')
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')

  // Check date field  
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')

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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')

  // Check whether 'Annuleren' button exists
  cy.get('.css-1doc3ye')

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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')

  // Check whether 'Opslaan' button exists
  cy.get('.css-r3jkky')

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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')

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
  cy.get('.css-1ybnofw > :nth-child(2) > .chakra-stack')
    .click()
  cy.url().should('contains', Cypress.config().baseUrl + '/burgers/')

  // Navigate to first displayed agreement's detail page
  cy.get(':nth-child(5) > .chakra-button')
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
  cy.get('.chakra-modal__footer')
    .scrollIntoView() // Scrolls 'footer' into view
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')
    .scrollIntoView() // Scrolls modal footer into view
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')
    .scrollIntoView() // Scrolls modal footer into view
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')
    .scrollIntoView() // Scrolls modal footer into view
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
  cy.get(':nth-child(3) > .css-1loywkv > div.css-0 > .css-8g8ihq > :nth-child(2) > .chakra-stack > .chakra-text')
    .then(($value) => {
      agreementValue = $value.text() // Store the agreement amount in a variable
      const newValue1 = agreementValue.slice(2) // Remove the valuta symbol from string
      const newValue2 = newValue1.replace(",", ".") // Replace the comma with a full stop
  cy.get('h2').contains('Alarm').should('be.visible')
    .scrollIntoView() // Scrolls 'Alarm' into view
  cy.contains('Toevoegen')
  cy.get('.css-1loywkv > :nth-child(1) > .chakra-stack > div.css-0 > .chakra-button')
    .click()
  cy.wait(500) // Wait 0.5 seconds for modal opening
  
  // Check whether modal is opened and visible
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')

  // Check field  
  cy.get('\#field\\-\\\:r1b\\\:')
    .invoke('val')
    .then((val2) => {
      expect(val2).to.eq(newValue2)

  // Clear and refill field  
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
  cy.contains('Alarm toevoegen')
  cy.get('.chakra-modal__footer')
    .scrollIntoView() // Scrolls modal footer into view
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

