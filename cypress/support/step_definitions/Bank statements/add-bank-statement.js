
import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

const dayjs = require('dayjs');

const modalWait = 4000;

//#region Scenario: invalid format

When('I select "Wrong_format_CAMT.053_v1.xml"', () => {

  cy.get('input[type="file"]')
    .selectFile('voorbeeldbankafschriften/Wrong_format_CAMT.053_v1.xml', { force: true })

});

Then('the "Wrong_format_CAMT.053_v1.xml" filename is displayed', () => {

  cy.contains('Wrong_format_CAMT.053_v1.xml') // Assert selected filename is displayed

});

Then('the file upload error status icon is displayed', () => {

  cy.contains('camt053-kosten-betalingsverkeer-20231130.xml') // Assert selected filename is displayed

});

Then('the "Format is not CAMT.053.001.02" text is displayed', () => {

  cy.contains('Format is not CAMT.053.001.02') // Assert error message

});


//#endregion

//#region Scenario: other bank account iban

When('I select "Wrong_bank_account_iban_CAMT.053_v1.xml"', () => {

  cy.get('input[type="file"]')
    .selectFile('voorbeeldbankafschriften/Wrong_bank_account_iban_CAMT.053_v1.xml', { force: true })

});

Then('the "Wrong_bank_account_iban_CAMT.053_v1.xml" filename is displayed', () => {

  cy.contains('Wrong_bank_account_iban_CAMT.053_v1.xml') // Assert selected filename is displayed

});

Then('the "Bank account in file does not match bank account in application" text is displayed', () => {

  cy.contains('Bank account in file does not match bank account in application') // Assert error message

});

//#endregion

//#region Scenario: no transactions in file

When('I select "Empty_customer_statement_message_CAMT.053_v2.xml"', () => {

  Step(this, 'I click the "Add bank statement" button');
  
  cy.get('input[type="file"]')
    .selectFile('voorbeeldbankafschriften/Empty_customer_statement_message_CAMT.053_v2.xml', { force: true });
  cy.wait(modalWait)

});

Then('the "Empty_customer_statement_message_CAMT.053_v2.xml" filename is displayed', () => {

  cy.contains('Empty_customer_statement_message_CAMT.053_v2.xml');

});

Then('the file upload warning status icon is displayed', () => {

  cy.get('[data-test="bankstatement.warningIcon"]')
    .should('be.visible');

});

Then('the "No transactions in file" text is displayed', () => {

  cy.contains('No transactions in file');

});

When('I click the "Close modal" button', () => {

  cy.get('button[aria-label="Close"]')
    .click();

});

Then('the "Empty_customer_statement_message_CAMT.053_v2.xml" file is displayed', () => {

  cy.contains('Empty_customer_statement_message_CAMT.053_v2.xml');

});

Then('0 transactions were added', () => {

  cy.visit('/bankzaken/transacties');
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/transacties');

  cy.get('[data-test="transactionsPage.filters.allReconciliated"]', { timeout: 10000 })
    .click();
  cy.contains('Er zijn geen banktransacties gevonden', { timeout: 10000 })

});


//#endregion

//#region Scenario: duplicate file

When('I select "Duplicate_bank_transaction_1_CAMT.053_v1.xml"', () => {

  cy.get('input[type="file"]')
    .selectFile('voorbeeldbankafschriften/Duplicate_bank_transaction_1_CAMT.053_v1.xml', { force: true })

});

Then('the "Duplicate_bank_transaction_1_CAMT.053_v1.xml" filename is displayed', () => {

  cy.contains('Duplicate_bank_transaction_1_CAMT.053_v1.xml') // Assert selected filename is displayed

});

When('I select "Duplicate_bank_transaction_2_CAMT.053_v1.xml"', () => {

  cy.get('input[type="file"]')
    .selectFile('voorbeeldbankafschriften/Duplicate_bank_transaction_2_CAMT.053_v1.xml', { force: true })

});

Then('the "Duplicate_bank_transaction_2_CAMT.053_v1.xml" filename is displayed', () => {

  cy.contains('Duplicate_bank_transaction_2_CAMT.053_v1.xml') // Assert selected filename is displayed

});

Then('the "Duplicate file" text is displayed', () => {

  cy.contains('Duplicate file') // Assert error message is displayed

});


Then('the "Duplicate_bank_transaction_2_CAMT.053_v1.xml" file is not displayed', () => {

  cy.get('body')
    .should('not.contain', 'Duplicate_bank_transaction_2_CAMT.053_v1.xml'); // Assert selected filename is not displayed

});

When('I set the "Date from" filter to "3-4-2023"', () => {

  cy.get('[data-test="transactionsPage.filters.from"]', { timeout: 10000 })
    .type('3-4-2023{enter}');

});

When('I set the "Date to" filter to "3-4-2023"', () => {

  cy.get('[data-test="transactionsPage.filters.to"]', { timeout: 10000 })
    .type('3-4-2023{enter}');

});

Then('the bank transaction amount is "-234,56"', () => {

  // Assert bank transaction amount
  cy.contains('-234,56', { timeout: 10000 })

});

Then('1 bank transaction with "GEMEENTE UTRECHT" name is displayed', () => {

  // Assert only one transaction
  cy.find('contains("GEMEENTE UTRECHT")', { timeout: 10000 })
    .should('have.length', 1);

});


//#endregion

//#region Scenario: add bank transaction without iban

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
  cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/bankafschriften')

});
 
When('I click the "Add bank statement" button', () => {

  cy.get('input[type="file"]')
    .click({ force: true })
 
});
 
When('I select "camt053-kosten-betalingsverkeer-20231130.xml"', () => {

  cy.get('input[type="file"]')
    .selectFile('voorbeeldbankafschriften/camt053-kosten-betalingsverkeer-20231130.xml', { force: true })
  cy.wait(modalWait)

});

Then('the "Add bank statement" modal opens', () => {
  
  cy.get('header', { timeout: 10000 })
    .contains('Bankafschrift toevoegen')

});

Then('the close "Add bank statement" modal button is displayed', () => {

  cy.get('[aria-label="Close"]') // Assert "Close modal" button is displayed
    .should('exist')  
    .should('be.visible')

});

Then('the "camt053-kosten-betalingsverkeer-20231130.xml" filename is displayed', () => {

  cy.contains('camt053-kosten-betalingsverkeer-20231130.xml') // Assert selected filename is displayed

});

Then('the file upload success status icon is displayed', () => {

  cy.get('[data-test="uploadItem.check"]') // Assert file upload status icon is displayed
    .should('be.visible')

});

When('I click the close "Add bank statement" modal button', () => {

  // Close modal
  cy.get('[aria-label="Close"]', { timeout: 10000 })
    .should('exist')  
    .should('be.visible')
    .click() // Assert clicking 'Close' button works

});

Then('the "Add bank statement" modal closes', () => {

  // Assertion
  cy.get('header[id^="chakra-modal"]', { timeout: 10000 })
    .should('not.exist');

});

Then('the bank statement filename is displayed', () => {

  // Assert that the bank statement filename is displayed
  cy.contains('camt053-kosten-betalingsverkeer-20231130.xml')

});

Then('the bank statement upload timestamp is displayed', () => {
 
  // Set timestamp
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

});

When('I click the "Advanced search options" button', () => {

  cy.get('[data-test="transactions.expandFilter"]', { timeout: 10000 })
    .click();

});

When('I set the "Date from" filter to "1-12-2023"', () => {

  cy.get('[data-test="transactionsPage.filters.from"]', { timeout: 10000 })
    .type('1-12-2023{enter}');

});

When('I set the "Date to" filter to "1-12-2023"', () => {

  cy.get('[data-test="transactionsPage.filters.to"]', { timeout: 10000 })
    .type('1-12-2023{enter}');

});

Then('a bank transaction with "Onbekende IBAN" name is displayed', () => {

  // Assert that transaction with "Onbekende IBAN" name is displayed
  cy.contains('Onbekende IBAN', { timeout: 10000 })

});

Then('the bank transaction amount is "-281,94"', () => {

  // Assert that bank transaction amount is "-281,94"
  cy.contains('-281,94', { timeout: 10000 })

});

When('I click the "-281,94" bank transaction', () => {

  // Click the bank transaction
  cy.contains('-281,94', { timeout: 10000 })
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/bankzaken/transacties/')

});

When('I click the "Rubriek" button', () => {

  // Click the bank transaction
  cy.contains('-281,94', { timeout: 10000 })
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
      
});

//#endregion

//#region Scenario: add bank transaction with payment mandate

Given('the "Gemeente Utrecht" organisation exists', () => {

  cy.visit('/organisaties');
  cy.url().should('eq', Cypress.config().baseUrl + '/organisaties');
  cy.get('input[placeholder="Zoeken"]')
    .type('Gemeente');
  cy.contains('Utrecht');

});

Given('the "Gemeente Utrecht" organisation has a department "GEMEENTE UTRECHT" with the "NL71ABNA0411065785" bank account', () => {

  cy.contains('Utrecht')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/organisaties/');
  
  // Assert that department is available
  cy.get('p[title="Gemeente Utrecht"]')
    .click();
  cy.url().should('include', '/afdelingen/');  

  // Assert that bank account is available
  cy.contains('NL71 ABNA 0411 0657 85');

});

When('I select "Payment_mandate_CAMT.053_v1.xml"', () => {

  cy.get('input[type="file"]')
    .selectFile('voorbeeldbankafschriften/Payment_mandate_CAMT.053_v1.xml', { force: true })

});

Then('the "Payment_mandate_CAMT.053_v1.xml" filename is displayed', () => {

  cy.contains('Payment_mandate_CAMT.053_v1.xml');

});

When('I set the "Date from" filter to "15-2-2024"', () => {

  cy.get('[data-test="transactionsPage.filters.from"]', { timeout: 10000 })
    .type('15-2-2024{enter}');

});

When('I set the "Date to" filter to "15-2-2024"', () => {

  cy.get('[data-test="transactionsPage.filters.to"]', { timeout: 10000 })
    .type('15-2-2024{enter}');

});

Then('a bank transaction with "GEMEENTE UTRECHT" name is displayed', () => {

  // Assert transaction name
  cy.contains('GEMEENTE UTRECHT', { timeout: 10000 })

});

Then('the bank transaction amount is "-654,32"', () => {

  // Assert bank transaction amount
  cy.contains('-654,32', { timeout: 10000 })

});

When('I click the "-654,32" bank transaction', () => {

  // Click the bank transaction
  cy.contains('-654,32', { timeout: 10000 })
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/bankzaken/transacties/')

});

Then('the bank transaction description contains the "123456789" end-to-end id', () => {

  cy.contains('123456789');

});

Then('the bank transaction description contains the "5784272" mandate id', () => {

  cy.contains('5784272');

});

//#endregion

//#region Scenario: add basic bank transaction

Given('the "Gemeente Utrecht" organisation has a department "GEM UTRECHT WENI" with the "NL76BNGH0285178598" bank account', () => {

  cy.contains('Utrecht')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/organisaties/');
  
  // Assert that department is available
  cy.get('p[title="Gemeente Utrecht"]')
    .click();
  cy.url().should('include', '/afdelingen/');  

  // Assert that bank account is available
  cy.contains('NL76 BNGH 0285 1785 98');

});

When('I select "Basic_bank_transaction_CAMT.053_v1.xml"', () => {

  cy.get('input[type="file"]')
    .selectFile('voorbeeldbankafschriften/Basic_bank_transaction_CAMT.053_v1.xml', { force: true })

});

Then('the "Basic_bank_transaction_CAMT.053_v1.xml" filename is displayed', () => {

  cy.contains('Basic_bank_transaction_CAMT.053_v1.xml') // Assert selected filename is displayed

});

When('I set the "Date from" filter to "27-10-2023"', () => {

  cy.get('[data-test="transactionsPage.filters.from"]', { timeout: 10000 })
    .type('27-10-2023{enter}');

});

When('I set the "Date to" filter to "27-10-2023"', () => {

  cy.get('[data-test="transactionsPage.filters.to"]', { timeout: 10000 })
    .type('27-10-2023{enter}');

});

Then('a bank transaction with "GEM UTRECHT WENI" name is displayed', () => {

  // Assert that transaction name is displayed
  cy.contains('GEM UTRECHT WENI', { timeout: 10000 })

});

Then('the bank transaction amount is "1251,26"', () => {

  // Assert bank transaction amount
  cy.contains('1.251,26', { timeout: 10000 })

});

When('I click the "1251,26" bank transaction', () => {

  // Click the bank transaction
  cy.contains('1.251,26', { timeout: 10000 })
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/bankzaken/transacties/')

});

Then('the bank transaction description contains "Normale bijschrijving"', () => {

  cy.contains('/TRTP/SEPA betaalbatch via BNG BTV/REMI/Normale bijschrijving');

});

Then('the bank transaction description contains the "000000013289682" end-to-end id', () => {

  cy.contains('000000013289682');

});

//#endregion

//#region Scenario: add bank transaction with negative amount

When('I select "Negative_amount_CAMT.053_v1.xml"', () => {

  cy.get('input[type="file"]')
    .selectFile('voorbeeldbankafschriften/Negative_amount_CAMT.053_v1.xml', { force: true })

});

Then('the "Negative_amount_CAMT.053_v1.xml" filename is displayed', () => {

  cy.contains('Negative_amount_CAMT.053_v1.xml') // Assert selected filename is displayed

});

Then('the "Customer statement message contains entry with negative amount" notification is displayed', () => {

  cy.contains('Customer statement message contains entry with negative amount') // Assert error message

});

//#endregion