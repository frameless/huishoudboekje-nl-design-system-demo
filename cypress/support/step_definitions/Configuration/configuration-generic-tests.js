
import { Before, After, When, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

Before({ tags: "@beforeCleanupPaymentInstruction" }, function (){

  Step(this, "I navigate to the page '/configuratie'");
  
  // Clean up derdengeldenrekening_bic
  cy.contains("derdengeldenrekening_bic")
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  cy.contains("derdengeldenrekening_bic")
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  
  Step(this, "a notification of success is displayed");

  cy.wait(3000);

    // Clean up derdengeldenrekening_iban
    cy.contains("derdengeldenrekening_iban")
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  cy.contains("derdengeldenrekening_iban")
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  
  Step(this, "a notification of success is displayed");

  cy.wait(3000);

    // Clean up derdengeldenrekening_rekeninghouder
    cy.contains("derdengeldenrekening_rekeninghouder")
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  cy.contains("derdengeldenrekening_rekeninghouder")
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  
  Step(this, "a notification of success is displayed");

  cy.wait(3000);

});

After({ tags: "@afterCleanupPaymentInstruction" }, function (){

  // Clean up agreement
  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type('Allie');
  cy.waitForReact();
  cy.contains('Noble')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/burgers/')
  cy.get('p').contains('Maandelijks leefgeld HHB000003')
    .parent()
    .next()
    .next()
    .next()
    .children('a[aria-label="Bekijken"]')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/afspraken/')
  cy.get('[data-test="agreement.menuKebab"]')
    .click();
  cy.get('[data-test="agreement.menuDelete"]')
    .click();
  cy.get('[data-test="button.AlertDelete"]')
    .click();
  
  // Check success message
  cy.get('[data-status="success"]')
    .contains('afspraak')
    .should('be.visible');

});

After({ tags: "@afterCleanupCreateSettings" }, function (){

  // Clean up configuration
  cy.contains("Dit_is_de_sleutel")
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  cy.contains("Dit_is_de_sleutel")
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  
  Step(this, "a notification of success is displayed");

});

After({ tags: "@afterCleanupManageClassifications" }, function (){

  Step(this, "I navigate to the page '/configuratie'");

  // Clean up configuration 1
  cy.contains("WRevHuoHuo")
    .parentsUntil('tbody')
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  cy.contains("WRevHuoHuo")
    .parentsUntil('tbody')
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  
  Step(this, "a notification of success is displayed");

  cy.wait(3000);

  // Clean up configuration 2
  cy.contains("WKprAklEkn")
    .parentsUntil('tbody')
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  cy.contains("WKprAklEkn")
    .parentsUntil('tbody')
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();

  Step(this, "a notification of success is displayed");

});

After({ tags: "@afterCleanupDefaultAmountDeviation" }, function (){

  Step(this, "I navigate to the page '/configuratie'");
  
  // Clean up configuration
  cy.contains("alarm_afwijking_bedrag")
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  cy.contains("alarm_afwijking_bedrag")
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  
  Step(this, "a notification of success is displayed");

  // Clean up agreement
  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type('Carly');
  cy.waitForReact();
  cy.contains('Padilla')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/burgers/')
  cy.get('p').contains('Periodieke uitkering')
    .parent()
    .next()
    .next()
    .next()
    .children('a[aria-label="Bekijken"]')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/afspraken/')
  cy.get('[data-test="agreement.menuKebab"]')
    .click();
  cy.get('[data-test="agreement.menuDelete"]')
    .click();
  cy.get('[data-test="button.AlertDelete"]')
    .click();
  
  // Check success message
  cy.get('[data-status="success"]')
    .contains('afspraak')
    .should('be.visible');

});

After({ tags: "@afterCleanupDefaultDateDeviation" }, function (){

  Step(this, "I navigate to the page '/configuratie'");
  
  // Clean up configuration
  cy.contains("alarm_afwijking_datum")
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  cy.contains("alarm_afwijking_datum")
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  
  Step(this, "a notification of success is displayed");

  // Clean up agreement
  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type('Carly');
  cy.waitForReact();
  cy.contains('Padilla')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/burgers/')
  cy.get('p').contains('Periodieke uitkering')
    .parent()
    .next()
    .next()
    .next()
    .children('a[aria-label="Bekijken"]')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/afspraken/')
  cy.get('[data-test="agreement.menuKebab"]')
    .click();
  cy.get('[data-test="agreement.menuDelete"]')
    .click();
  cy.get('[data-test="button.AlertDelete"]')
    .click();
  
  // Check success message
  cy.get('[data-status="success"]')
    .contains('afspraak')
    .should('be.visible');

});
