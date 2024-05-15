
import { Given, When, Then, Step, DataTable } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

const folder = Cypress.config().downloadsFolder;

//#region - Scenario: set sepa payment instruction bank account

When('I open the "Citizen details" page for the "Allie Noble" citizen', () => {
  cy.clearLocalStorage()
  // Navigate to citizen
  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type('Allie');
  cy.waitForReact();
  cy.contains('Noble')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/burgers/')

});

Given('the "Privé-opname" exists with the accounting reference "BEivKapProPok"', () => {

  cy.contains('Privé-opname');
  cy.contains('BEivKapProPok');

});

Then('the page is redirected to the agreement page', () => {

  cy.url().should('include', Cypress.config().baseUrl + '/afspraken/');

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

  cy.get('[data-test="input.dateRange"]')
    .type('{selectAll}01-05-2024 {enter}');

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

let difference = 0;

let file1 = "";
let file2 = "";

Then('I click the button "Downloaden" for the most recent entry', function () {
    
  // cy.task('filesInDownload', folder).then(files1 => {

  //   file1 = files1;

  // })

  // Click on download button
  cy.get('[data-test="button.Download"]')
    .first()
    .click()
  cy.wait(3000);

});

Then('the exported file contains {string}', (string) => {

  cy.task('filesInDownload', folder).then(files2 => {
   // difference = files2.filter(x => !file1.includes(x));
    //expect(difference.length).to.be.gt(0)
  
  cy.readFile(folder + '/' + files2[0]).should('contains', string);

  })

  // cy.readFile('Huishoudboekje*.xml').should('contains', string);

});


//#endregion