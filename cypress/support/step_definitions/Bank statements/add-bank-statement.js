
import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

const dayjs = require('dayjs');

const modalWait = 4000;

Then('Clean up bank statement', () => {

  // Clean up bank statement
  cy.visit('/bankzaken/bankafschriften');
  cy.waitForReact();
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')
  cy.waitForReact();
  cy.get('[aria-label="Verwijderen"]')
    .click();
  cy.waitForReact();
  cy.get('[aria-label="Verwijderen"]')
    .click();
  cy.waitForReact();
  cy.get('[data-status="success"]')
    .should('be.visible');

});

Then('Add bank statement without cleaning up', () => {

  Step(this, 'I click the "Add bank statement" button');
  
  cy.get('input[type="file"]')
    .selectFile('voorbeeldbankafschriften/camt053-kosten-betalingsverkeer-20231130.xml', { force: true });
  cy.wait(modalWait)
  cy.get('[data-test="uploadItem.check"]') // Assert file upload status icon is displayed
    .should('be.visible')

  // Close modal
  cy.get('[aria-label="Close"]')
    .should('exist')  
    .should('be.visible')
    .click()

});

When('I view the "Bank statement" page', () => {

  cy.visit('/bankzaken/bankafschriften')
  cy.waitForReact()
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')

});
 
When('I click the "Add bank statement" button', () => {

  cy.get('input[type="file"]')
    .should('exist')
    .click({ force: true })
 
});
 
When('I select "camt053-kosten-betalingsverkeer-20231130.xml"', () => {

  cy.get('input[type="file"]')
    .selectFile('voorbeeldbankafschriften/camt053-kosten-betalingsverkeer-20231130.xml', { force: true })

});

Then('the "Add bank statement" modal opens', () => {

  cy.wait(modalWait)
  cy.get('header')
    .contains('Bankafschrift toevoegen')

});

Then('the close "Add bank statement" modal button is displayed', () => {

  cy.get('[aria-label="Close"]') // Assert "Close modal" button is displayed
    .should('exist')  
    .should('be.visible')

});

Then('the selected filename is displayed', () => {

  cy.contains('camt053-kosten-betalingsverkeer-20231130.xml') // Assert selected filename is displayed

});

Then('the file upload status icon is displayed', () => {

  cy.get('[data-test="uploadItem.check"]') // Assert file upload status icon is displayed
    .should('be.visible')

});

When('I click the close "Add bank statement" modal button', () => {

  // Close modal
  cy.get('[aria-label="Close"]')
    .should('exist')  
    .should('be.visible')
    .click() // Assert clicking 'Close' button works

});

Then('the "Add bank statement" modal closes', () => {

  // Assertion
  cy.get('header[id^="chakra-modal"]')
    .should('not.exist');

});

Then('the bank statement filename is displayed', () => {

  // Assert that the bank statement filename is displayed
  cy.contains('camt053-kosten-betalingsverkeer-20231130.xml')

});

Then('the bank statement upload timestamp is displayed', () => {
 
  // Set timestamp
  // function addZero(i) {
  //   if (i < 10) {i = "0" + i}
  //   return i;
  // }
  // const d = new Date();
  // //let h = addZero(d.getUTCHours()); // Change this to 'getHours' once frontend starts using local time
  // let m = addZero(d.getMinutes());
  
  // Assert that the bank statement upload timestamp is displayed
  //cy.contains(h + ":" + m);
  cy.contains(":");
  const date = dayjs().format('DD-MM-YYYY')
  cy.contains(date);

});

Then('the "Delete bank statement" button is displayed', () => {

  // Assert that the "Delete bank statement" button is displayed
  cy.get('[aria-label="Verwijderen"]')
    .should('be.visible')

});

Then('the "Add bank statement" button is displayed', () => {

  // Assert that the "Add bank statement" button is displayed
  cy.get('[data-test="fileUpload"]')
    .should('be.visible')

});

When('I view the "Bank transactions" page', () => {

  cy.visit('/bankzaken/transacties');
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/transacties');
  cy.waitForReact();

});

When('I click the "Advanced search options" button', () => {

  cy.waitForReact();
  cy.get('[data-test="transactions.expandFilter"]')
    .click();

});

When('I set the "Date from" filter to "1-12-2023"', () => {

  cy.wait(1000);
  cy.get('[data-test="transactionsPage.filters.from"]')
    .type('1-12-2023{enter}');

});

When('I set the "Date to" filter to "1-12-2023"', () => {

  cy.wait(1000);
  cy.get('[data-test="transactionsPage.filters.to"]')
    .type('1-12-2023{enter}');

});

Then('a bank transaction with "Onbekende IBAN" name is displayed', () => {

  // Assert that transaction with "Onbekende IBAN" name is displayed
  cy.wait(1000);
  cy.contains('Onbekende IBAN')

});

Then('the bank transaction amount is "-281,94"', () => {

  // Assert that bank transaction amount is "-281,94"
  cy.waitForReact();
  cy.contains('-281,94');

});

When('I click the bank transaction', () => {

  // Click the bank transaction
  cy.waitForReact();
  cy.contains('-281,94')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/bankzaken/transacties/')

});

When('I click the "Rubriek" button', () => {

  // Click the bank transaction
  cy.waitForReact();
  cy.contains('-281,94')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/bankzaken/transacties/')

  // Click the "Rubriek" button
  cy.get('[data-test="tab.bookingSection.rubric"]')
    .click();
  
});

When('I select the "Lokale lasten" option', () => {

  // Select the "Lokale lasten" option
  cy.contains('Select...')
    .click({ force: true })
  cy.contains('Lokale lasten')
    .click({ force: true })
  
});

Then('a success-notification is displayed', () => {

  // Assert that a notification of success is displayed
  cy.get('[data-status="success"]')
    .should('be.visible');

});

Then('the status is "Handmatig afgeletterd"', () => {

  // Assert that the status is "Handmatig afgeletterd"
  cy.contains('Handmatig afgeletterd')

});

Then('the "Rubriek" button is not displayed', () => {

  // Assert that the "Rubriek" button is not displayed
  cy.get('[data-test="tab.bookingSection.rubric"]')
    .should('not.exist');
      
});

Then('the classification is "Lokale lasten"', () => {

  // Assert that the classification is "Lokale lasten"
  cy.contains('Lokale lasten')

});

Then('the "Afletteren ongedaan maken" button is displayed', () => {

  // Assert that the "Afletteren ongedaan maken" button is displayed
  cy.get('[data-test="button.undoReconciliation"]')
    .should('be.visible');
      
  // Clean up
  Step(this, 'Clean up bank statement');

});