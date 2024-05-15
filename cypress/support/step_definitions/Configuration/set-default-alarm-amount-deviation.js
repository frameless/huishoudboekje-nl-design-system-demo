
import { Given, When, Then, Step, DataTable } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region - Scenario: save default alarm amount deviation

Given('the "Gemeente Utrecht" department exists', () => {

  cy.contains('Utrecht')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/organisaties/');
  
  // Assert that department is available
  cy.get('p[title="Gemeente Utrecht"]')
    .click();
  cy.url().should('include', '/afdelingen/');  

});

Given('the "Gemeente Utrecht" department has the "Postbus 16200, 3500CE Utrecht" postal address', () => {

  // Assert that postal address is available
  cy.contains('16200');
  cy.contains('3500CE');
  cy.contains('Utrecht');

});

Given('the "Gemeente Utrecht" department has the "NL49BNGH0285171712" IBAN', () => {

  // Assert that bank account is available
  cy.contains('NL49 BNGH 0285 1717 12');

});

Given('the "Gemeente Utrecht" department has the "Gemeente Utrecht Huishoudboekje" account holder name', () => {

  // Assert that bank account is available
  cy.contains('Gemeente Utrecht Huishoudboekje');

});


Given('the "Uitkeringen" classification exists', () => {

  cy.contains('Uitkeringen');

});

Given('the "Add key-value pair form" is displayed', () => {

  cy.get('[data-test="section.parameter"]')
    .should('be.visible');

});

When('I open the "Citizen details" page for the "Carly Padilla" citizen', () => {

  // Navigate to citizen
  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type('Carly');
  cy.waitForReact();
  cy.contains('Padilla')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/burgers/')

});

When('I set the "Partij" option to "Organisatie"', () => {

  cy.get('[data-test="radio.agreementOrganization"]')
    .click();

});

Then('the field {string} is displayed', (field) => {

  cy.contains(field);

});

When('I set the field "Organisatie" to {string}', (input) => {

  // Chop off string for search
  var inputSlice = input.slice(0, input.length - 3);

  cy.get('#organisatie')
    .type(inputSlice)
  cy.contains(input)
    .click({ force: true });

  cy.wait(2000);

});

When('the field "Afdeling" is set to {string}', (input) => {

  cy.get('#afdeling')
    .contains(input)

  cy.wait(500);

});

When('I set the field "Postadres" to {string}', (input) => {

  // Chop off string for search
  var inputSlice = input.slice(0, input.length - 3);

  cy.get('#postadres')
    .type(inputSlice)
  cy.wait(500);
  cy.contains(input)
    .click({ force: true });
  cy.wait(500);

});

When('I set the field "Tegenrekening" to {string}', (input) => {

  cy.get('#tegenrekening')
    .click()
  cy.contains(input)
    .click({ force: true });

});

When('I set the field "Rubriek" to {string}', (input) => {

  // Chop off string for search
  var inputSlice = input.slice(0, input.length - 3);

  cy.get('#rubriek')
    .type(inputSlice)
  cy.contains(input)
    .click({ force: true });

});

When('I set the field "Omschrijving" to {string}', (input) => {

  cy.get('[data-test="select.agreementIncomeDescription"]')
    .type(input);

});

When('I set the field "Bedrag" to {string}', (input) => {

  cy.get('[data-test="select.agreementIncomeAmount"]')
    .type(input);

});

When('I set the field "Startdatum" to {string}', (input) => {

  cy.get('[data-test="input.startDate"]')
    .type('{selectAll}' + input + '{enter}');

});

Then('the "Toegestane afwijking bedrag" field is set to {string}', (number) => {

  // Check 'Toegestane afwijking bedrag (in euro's)' field  
  cy.get('[data-test="alarmForm.amountMargin"]')
    .should('have.value', number)

});

//#endregion