
import { Given, When, Then, Step, DataTable } from "@badeball/cypress-cucumber-preprocessor";


//#region - Scenario: view add key-value pair form

Then('the "Add classification form" is displayed', () => {

  cy.get('[data-test="section.rubric"]')
    .should('be.visible');

});
 
Then('the field "Naam" is marked as required', () => {

  cy.get('[data-test="input.Naam"]')
    .should('have.attr', 'aria-required')
    .should('eq', 'true');

});

Then('the field "Naam" is empty', () => {

  cy.get('[data-test="input.Naam"]')
    .should('have.attr', 'value')
    .should('eq', '');

});
 
Then('the field "Grootboekrekening" is marked as required', () => {

  cy.get('[data-test="button.rubricSubmit"]')
    .click();
  cy.contains('Vul een grootboekrekening in')

});

Then('the field "Grootboekrekening" is empty', () => {

  cy.contains('Kies een optie...');

});

When('the button "Opslaan" is displayed in the section with the header "Rubrieken"', () => {

  cy.get('[data-test="button.rubricSubmit"]')
    .should('be.visible');

});

//#endregion

//#region - Scenario: save classification with incoming payment direction

When('I set the "Naam" field to {string}', (string) => {

  cy.get('[data-test="input.Naam"]')
    .type(string)

});

When('I set the "Grootboekrekening" field to "Huuropbrengsten WRevHuoHuo"', () => {

  cy.get('[data-test="select.Grootboekrekening"]')
    .find('input')
    .type('Huuropbrengsten')
  cy.contains('WRevHuoHuo')
    .click()

});

When('I click the "Opslaan" button in the section with the header "Rubrieken"', () => {

  cy.get('[data-test="button.rubricSubmit"]')
    .click();

});

When('the "Huuropbrengsten" classification is displayed', () => {

  cy.contains('Huuropbrengsten');

});

When('I set the "Payment direction" option to "Inkomsten"', () => {

  cy.get('[data-test="radio.agreementIncome"]')
    .click();

});

When('the "Rubriek" option is displayed', () => {

  cy.get('#rubriek')

});

When('I click the "Rubriek" option', () => {

  cy.get('#rubriek')
    .click();

});

When('I set the "Payment direction" option to "Uitgaven"', () => {

  cy.get('[data-test="radio.agreementExpense"]')
    .click();

});

When('the "Huuropbrengsten" classification is not displayed', () => {

  cy.get('#rubriek')
    .should('not.contain', 'Huuropbrengsten');

});

//#endregion

//#region - Scenario: save classification with outgoing payment direction

When('I set the "Grootboekrekening" field to "Elektrakosten WKprAklEkn"', () => {

  cy.get('[data-test="select.Grootboekrekening"]')
    .find('input')
    .type('Elektrakosten')
  cy.contains('WKprAklEkn')
    .click()

});

When('the "Elektrakosten" classification is displayed', () => {

  cy.contains('Elektrakosten');

});

When('the "Elektrakosten" classification is not displayed', () => {

  cy.get('#rubriek')
    .should('not.contain', 'Elektrakosten');

});

//#endregion