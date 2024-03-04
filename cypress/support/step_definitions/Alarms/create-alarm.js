// cypress/support/step_definitions/Alarms/create-alarm.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

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

//#region Scenario: view create alarm form with default options

When('I view the "Add alarm" modal', () => {
  
  // Wipe alarms clean
    // Truncate alarms
    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateAlarm },
    }).then((res) => {
      console.log(res.body);
    });

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
 
  Step(this, 'I view the "Add alarm" modal');

  cy.waitForReact(); // Wait for modal opening
  
  // Check whether modal is opened and visible
  cy.get('section[aria-modal="true"]')
    .scrollIntoView()
    .should('be.visible')
  
});

Then('the recurrency is monthly', () => {
 
  Step(this, 'the "Create alarm form" is displayed');
  
  // Check recurrency
  cy.contains('Elke maand')
  
});

Then('the link "Meer opties" is displayed', () => {
 
  Step(this, 'the "Create alarm form" is displayed');

  // Check link 'Meer opties'
  cy.get('button')
    .contains('Meer opties')
  
});

Then('the start date is today', () => {
 
  Step(this, 'the "Create alarm form" is displayed');

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

  Step(this, 'the "Create alarm form" is displayed');

  // Check 'Dag in de maand' field  
  cy.get('[data-test="alarmForm.byMonthDay"]')
    .should('have.value', '')

});

Then('the allowed deviation in days is empty', () => {
 
  Step(this, 'the "Create alarm form" is displayed');

  // Check 'Toegestane afwijking (in dagen)' field  
  cy.get('[data-test="alarmForm.dateMargin"]')
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

  // Check 'Bedrag verwachte betaling' field  
  cy.get('[data-test="alarmForm.amount"]')
    .invoke('val')
    .should((val2) => {
      expect(val2).to.eq(newValue2)
    })
  })

});

Then('the allowed deviation in amount is empty', () => {
 
  Step(this, 'the "Create alarm form" is displayed');

  // Check 'Toegestane afwijking bedrag (in euro's)' field  
  cy.get('[data-test="alarmForm.amountMargin"]')
    .should('have.value', '')

});

Then('the "Cancel" button is displayed', () => {
 
  Step(this, 'the "Create alarm form" is displayed');

  // Check whether 'Annuleren' button exists
  cy.get('button')
    .contains('Annuleren')

});

Then('the "Submit form" button is displayed', () => {
 
  Step(this, 'the "Create alarm form" is displayed');

  // Check whether 'Opslaan' button exists
  cy.waitForReact()
  cy.get('[data-test="alarmForm.buttonSubmit"]')
    .click()

});

Then('the "Close modal" button is displayed', () => {

  Step(this, 'the "Create alarm form" is displayed');

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
 
  Step(this, 'I view the "Add alarm" modal');

});

Then('a modal opens', () => {
 
  Step(this, 'the "Create alarm form" is displayed');
 
});

Then('I fill in the current date for alarm start date', () => {
 
  Step(this, 'the "Create alarm form" is displayed');

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
    .type(dateNow)
    .should('have.value', dateNow)

});

Then('I fill in the alarm day of the month', () => {
 
  Step(this, 'the "Create alarm form" is displayed');

  // Check 'Dag in de maand' field  
  cy.get('[data-test="alarmForm.byMonthDay"]')
    .should('have.value', '')

  // Fill in 'Dag in de maand' field
  cy.get('[data-test="alarmForm.byMonthDay"]')
    .type('1')
    .should('have.value', '1')

});

Then('I fill in the alarm allowed deviation in days', () => {
 
  Step(this, 'the "Create alarm form" is displayed');

  // Check 'Toegestane afwijking (in dagen)' field  
  cy.get('[data-test="alarmForm.dateMargin"]')
    .should('have.value', '')

  // Fill in 'Toegestane afwijking (in dagen)' field  
  cy.get('[data-test="alarmForm.dateMargin"]')
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

Then('I fill in the alarm allowed deviation in payment amount', () => {
 
  Step(this, 'the "Create alarm form" is displayed');

  // Check 'Toegestane afwijking bedrag (in euro's)' field  
  cy.get('[data-test="alarmForm.amountMargin"]')
    .should('have.value', '')

  // Fill in 'Toegestane afwijking bedrag (in euro's)' field  
  cy.get('[data-test="alarmForm.amountMargin"]')
    .type('1')
    .should('have.value', '1')

});

Then('I click the "Submit form" button', () => {
 
  Step(this, 'the "Create alarm form" is displayed');

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

    // 'Toegestane afwijking bedrag (in euro's)'
    cy.get('[data-test="alarmForm.amountMargin"]')
      .type('1')
      .should('have.value', '1')

  // Click 'Opslaan' button
  cy.waitForReact()
  cy.get('[data-test="alarmForm.buttonSubmit"]')
    .click()

  // Wait for modal to close
  cy.waitForReact();
  
});

Then('the modal is closed', () => {

  // Clean up
    // Truncate alarms
    cy.request({
      method: "post",
      url: Cypress.env().graphqlUrl + '/graphql',
      body: { query: queryTruncateAlarm },
    }).then((res) => {
      console.log(res.body);
    });
  
  cy.wait(1000);

  Step(this, 'I click the "Submit form" button');

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
 
  Step(this, 'the "Create alarm form" is displayed');

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
  cy.get('[data-test="alarmForm.buttonSubmit"]')
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
 
  Step(this, 'the "Create alarm form" is displayed');

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
  cy.get('[data-test="alarmForm.buttonSubmit"]')
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

