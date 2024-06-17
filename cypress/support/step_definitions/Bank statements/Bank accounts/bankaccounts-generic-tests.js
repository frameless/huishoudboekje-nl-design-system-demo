// cypress/support/step_definitions/Bank statements/Bank accounts/generic-tests.js

import { Before, After, Step } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

// Clean-up testdata after Scenario 'organisation and bank account are not used for reconciliation'
After({ tags: "@cleanupAgreement" }, function ()  {

  Step(this, 'I open the citizen overview page for "Dingus Bingus"');
  
  cy.get('p').contains('1337')
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

Before({ tags: "@cleanupDepartment" }, function ()  {

  cy.visit('/organisaties')
  cy.url().should('eq', Cypress.config().baseUrl + '/organisaties')

  // Type into search bar
  cy.get('input[placeholder="Zoeken"]')
    .type('UWV Utrecht')  
  cy.get('p[title="UWV Utrecht"]')
    .should('be.visible')
    .click();

  cy.contains('Meervoudig gebruik IBAN')
    .click();
  cy.url().should('include', '/afdelingen/')

  cy.get('[data-test="menuDepartment"]')
    .scrollIntoView()
    .click();
  cy.get('[data-test="menuDepartment.delete"]', { timeout: 10000 })
    .should('be.visible')
    .click();
  cy.get('[data-test="modalDepartment.delete"]', { timeout: 10000 })
    .should('be.visible')
    .click();

  // Check success message
  Step(this, "a success notification containing 'verwijderd' is displayed");

});

// Clean-up testdata
Before({ tags: "@cleanupOrganizationDepartment" }, function ()  {

  cy.visit('/organisaties');
  cy.url().should('eq', Cypress.config().baseUrl + '/organisaties');
  cy.get('input[placeholder="Zoeken"]')
    .type('Lorem Ipsum 1337');
  cy.get('p[title="Lorem Ipsum 1337"]')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/organisaties/');
  cy.get('p[title="Department of Testing"]')
    .click();

  // Delete department
  cy.url().should('include', '/afdelingen/');  
  cy.get('[data-test="menuDepartment"]')
    .click();
  cy.get('[data-test="menuDepartment.delete"]')
    .click();
  cy.get('[data-test="modalDepartment.delete"]')
    .click();
  
  // Check success message
  Step(this, "a success notification containing 'verwijderd' is displayed");

  cy.url().should('include', '/organisaties/');  

  // Delete organization
  cy.get('[data-test="menuOrganization"]', { timeout: 10000 })
    .click();
  cy.get('[data-test="menuOrganization.delete"]', { timeout: 10000 })
    .click();
  cy.get('[data-test="buttonModal.delete"]', { timeout: 10000 })
    .click();
  
  // Check success message
  Step(this, "a success notification containing 'Organisatie' is displayed");

});

// Added order to make this execute later than @cleanupAgreement
After({ tags: "@cleanupOrganizationDepartmentBankaccount" }, function ()  {

  cy.visit('/organisaties');
  cy.url().should('eq', Cypress.config().baseUrl + '/organisaties');
  cy.get('input[placeholder="Zoeken"]')
    .type('Lorem Ipsum 1337');
  cy.get('p[title="Lorem Ipsum 1337"]')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/organisaties/');
  cy.get('p[title="Department of Testing"]')
    .click();

  // Delete bank account
  cy.get('[data-test="buttonIcon.Delete"]')
    .click();
  cy.get('[data-test="button.Delete"]')
    .click();

  // Check success message
  Step(this, "a success notification containing 'Bankrekening' is displayed");
  
  // Delete department
  cy.url().should('include', '/afdelingen/');  
  cy.get('[data-test="menuDepartment"]')
    .click();
  cy.get('[data-test="menuDepartment.delete"]')
    .click();
  cy.get('[data-test="modalDepartment.delete"]')
    .click();
  
  // Check success message
  Step(this, "a success notification containing 'Afdeling' is displayed");

  cy.url().should('include', '/organisaties/');  

  // Delete organization
  cy.get('[data-test="menuOrganization"]', { timeout: 10000 })
    .click();
  cy.get('[data-test="menuOrganization.delete"]', { timeout: 10000 })
    .click();
  cy.get('[data-test="buttonModal.delete"]', { timeout: 10000 })
    .click();
  
  // Check success message
  Step(this, "a success notification containing 'Organisatie' is displayed");

});

After({ tags: "@cleanupOrganizationDepartmentPostaddressBankaccount", order: 9999 }, function ()  {

  cy.visit('/organisaties');
  cy.url().should('eq', Cypress.config().baseUrl + '/organisaties');
  cy.get('input[placeholder="Zoeken"]')
    .type('Lorem Ipsum 1337');
  cy.get('p[title="Lorem Ipsum 1337"]')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/organisaties/');
  cy.get('p[title="Department of Testing"]')
    .click();

  // Delete bank account
  cy.get('[data-test="buttonIcon.Delete"]')
    .click();
  cy.get('[data-test="button.Delete"]')
    .click();

  // Check success message
  Step(this, "a success notification containing 'Bankrekening' is displayed");
  
  // Delete post address
  cy.get('[data-test="departmentPostaddress.delete"]')
    .click();
  cy.get('[data-test="modalPostaddress.delete"]')
    .click();

  // Check success message
  Step(this, "a success notification containing 'Postadres' is displayed");

  // Delete department
  cy.url().should('include', '/afdelingen/');  
  cy.get('[data-test="menuDepartment"]')
    .click();
  cy.get('[data-test="menuDepartment.delete"]')
    .click();
  cy.get('[data-test="modalDepartment.delete"]')
    .click();
  
  // Check success message
  Step(this, "a success notification containing 'Afdeling' is displayed");

  cy.url().should('include', '/organisaties/');  

  // Delete organization
  cy.get('[data-test="menuOrganization"]', { timeout: 10000 })
    .click();
  cy.get('[data-test="menuOrganization.delete"]', { timeout: 10000 })
    .click();
  cy.get('[data-test="buttonModal.delete"]', { timeout: 10000 })
    .click();
  
  // Check success message
  Step(this, "a success notification containing 'Organisatie' is displayed");

});

After({ tags: "@cleanupStatements" }, function ()  {

  // Clean up
  Step(this, 'I truncate the alarms table in alarmenservice');
  Step(this, 'I truncate the signals table in alarmenservice');
  Step(this, 'I truncate the bank transaction tables');
  
});

After({ tags: "@cleanupStatement" }, function ()  {

  // Clean up
  Step(this, 'I truncate the alarms table in alarmenservice');
  Step(this, 'I truncate the signals table in alarmenservice');
  Step(this, 'I truncate the bank transaction tables');
  
});