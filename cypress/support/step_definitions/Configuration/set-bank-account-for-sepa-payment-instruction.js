
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import AfspraakDetails from "../../../pages/AfspraakDetails";
import Betaalinstructies from "../../../pages/Betaalinstructies";

const afspraakDetails = new AfspraakDetails()
const betaalinstructies = new Betaalinstructies()

const folder = Cypress.config().downloadsFolder;

//#region - Scenario: set sepa payment instruction bank account

Given('the "Privé-opname" exists with the accounting reference "BEivKapProPok"', () => {

  cy.contains('Privé-opname');
  cy.contains('BEivKapProPok');

});

Then('the page is redirected to the agreement page', () => {

  afspraakDetails.redirectToAfspraak()

});

When('I click the button "Toevoegen" in the section with the header "Betaalinstructie"', () => {

  cy.get('[data-test="section.paymentInstruction"]')
    .find('button')
    .contains('Toevoegen')
    .click();

});

Then('the page is redirected to the payment instruction page for this agreement', () => {

  cy.url().should('include', Cypress.config().baseUrl + '/afspraken/');
  cy.url().should('include', '/betaalinstructie');

});

When('I set the radio "Periodiek" to "Herhalend"', () => {

  cy.get('[data-test="radio.periodically"]')
    .click();

});

When('I set the field "Dag van de maand" to "1"', () => {

  cy.get('[data-test="input.byMonthDay"]')
    .type('{selectAll}1');

});

When('I set the select option "Herhaling" to "Maandelijks"', () => {

    cy.get('[data-test="select.repeat"]')
      .find('input')
      .type('Maand')
    cy.contains('Maandelijks')
      .click();

});

When('I set the field "Periode" to "01-05-2024 - 01-05-2024"', () => {

  betaalinstructies.inputDateRangeStart('01-05-2024');
  betaalinstructies.inputDateRangeEnd('01-05-2024');

});

When('the value "ABNANL2A" for the key "derdengeldenrekening_bic" is displayed', () => {

  cy.contains("derdengeldenrekening_bic")
    .parent()
    .contains("ABNANL2A");

});

When('the value "NL36ABNA5632579034" for the key "derdengeldenrekening_iban" is displayed', () => {

  cy.contains("derdengeldenrekening_iban")
    .parent()
    .contains("NL36ABNA5632579034");

});

When('the value "Gemeente Sloothuizen Huishoudboekje" for the key "derdengeldenrekening_rekeninghouder" is displayed', () => {

  cy.contains("derdengeldenrekening_rekeninghouder")
    .parent()
    .contains("Gemeente Sloothuizen Huishoudboekje");

});

Then('I click the button "Downloaden" for the most recent entry', function () {

  // Click on download button
  cy.get('[data-test="button.Download"]')
    .first()
    .click()

  // Wait for download to finish
  cy.wait(3000);

});

Then('the exported file contains {string}', (string) => {

  cy.task('filesInDownload', folder).then(files2 => {
    cy.readFile(folder + '/' + files2[0]).should('contains', string);
  })

});

//#endregion