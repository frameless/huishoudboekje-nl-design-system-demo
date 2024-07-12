
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
  
  // Check success message
  Step(this, "a success notification containing 'verwijderd' is displayed");

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
  
  // Check success message
  Step(this, "a success notification containing 'verwijderd' is displayed");

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
  
  // Check success message
  Step(this, "a success notification containing 'verwijderd' is displayed");

});

After({ tags: "@afterCleanupPaymentInstruction" }, function (){

  const folder = Cypress.config().downloadsFolder;

  // Clean up agreement
  Step(this, 'I open the citizen overview page for "Dingus Bingus"');

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
  Step(this, "a success notification containing 'afspraak' is displayed");

  cy.task('resetFolder', folder);

});

After({ tags: "@afterCleanupCreateSettings" }, function (){

  // Clean up configuration
  cy.contains("Dit_is_de_sleutel")
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  cy.contains("Dit_is_de_sleutel", { timeout: 10000 })
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
    
  // Check success message
  Step(this, "a success notification containing 'verwijderd' is displayed");

});

After({ tags: "@afterCleanupManageClassifications" }, function (){

  Step(this, "I navigate to the page '/configuratie'");

  // Clean up configuration 1
  cy.contains("WRevHuoHuo")
    .parentsUntil('tbody')
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  cy.contains("WRevHuoHuo", { timeout: 10000 })
    .parentsUntil('tbody')
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();

  // Check success message
  Step(this, "a success notification containing 'verwijderd' is displayed");

  // Clean up configuration 2
  cy.contains("WKprAklEkn")
    .parentsUntil('tbody')
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  cy.contains("WKprAklEkn", { timeout: 10000 })
    .parentsUntil('tbody')
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();

  // Check success message
  Step(this, "a success notification containing 'verwijderd' is displayed");

});

After({ tags: "@afterCleanupDefaultAmountDeviation" }, function (){

  Step(this, "I navigate to the page '/configuratie'");
  
  // Clean up configuration
  cy.contains("alarm_afwijking_bedrag")
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  cy.contains("alarm_afwijking_bedrag", { timeout: 10000 })
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();

  // Check success message
  Step(this, "a success notification containing 'verwijderd' is displayed");

  // Clean up agreement
  Step(this, 'I open the citizen overview page for "Dingus Bingus"');

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
  Step(this, "a success notification containing 'afspraak' is displayed");

});

After({ tags: "@afterCleanupDefaultDateDeviation" }, function (){

  Step(this, "I navigate to the page '/configuratie'");
  
  // Clean up configuration
  cy.contains("alarm_afwijking_datum")
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();
  cy.contains("alarm_afwijking_datum", { timeout: 10000 })
    .parent()
    .find('[data-test="button.Delete"]')
    .should('be.visible')
    .click();

  // Check success message
  Step(this, "a success notification containing 'verwijderd' is displayed");

  // Clean up agreement
  Step(this, 'I open the citizen overview page for "Dingus Bingus"');
  
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
  Step(this, "a success notification containing 'afspraak' is displayed");

});
