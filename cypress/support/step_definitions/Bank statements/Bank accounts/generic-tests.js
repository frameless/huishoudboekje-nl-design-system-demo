// cypress/support/step_definitions/Bank statements/Bank accounts/generic-tests.js

import { Before, After } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

// Clean-up testdata after Scenario 'organisation and bank account are not used for reconciliation'
After({ tags: "@cleanupAgreement" }, function ()  {

  cy.visit('/burgers');
  cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
  cy.get('input[placeholder="Zoeken"]')
    .type('Mcpherson');
  cy.waitForReact();
  cy.contains('Patterson')
    .click();
  cy.url().should('include', Cypress.config().baseUrl + '/burgers/')
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
  cy.get('[data-test="button.Delete"]')
    .click();
  
  // Check success message
  cy.get('[data-status="success"]')
    .contains('afspraak')
    .should('be.visible');

});

Before({ tags: "@cleanupDepartment" }, function ()  {

  cy.visit('/organisaties')
  cy.waitForReact()
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
  cy.get('[data-test="menuDepartment.delete"]')
    .click();
  cy.wait(500)
  cy.get('[data-test="modalDepartment.delete"]')
    .click();
  cy.waitForReact();

  // Check success message
  cy.get('[data-status="success"]')
    .contains('Afdeling')
    .contains('verwijderd')
    .should('be.visible')

});

// Clean-up testdata
After({ tags: "@cleanupOrganizationDepartment" }, function ()  {

  cy.visit('/organisaties');
  cy.waitForReact();
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
  cy.get('[data-status="success"]')
    .should('be.visible')

  cy.url().should('include', '/organisaties/');  

  // Delete organization
  cy.waitForReact();
  cy.get('[data-test="menuOrganization"]')
    .click();
  cy.waitForReact();
  cy.get('[data-test="menuOrganization.delete"]')
    .click();
  cy.waitForReact();
  cy.get('[data-test="buttonModal.delete"]')
    .click();
  cy.waitForReact();
  
  // Check success message
  cy.get('[data-status="success"]')
    .contains('Organisatie')
    .should('be.visible')

});

// Added order to make this execute later than @cleanupAgreement
After({ tags: "@cleanupOrganizationDepartmentBankaccount" }, function ()  {

  cy.visit('/organisaties');
  cy.waitForReact();
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
  cy.get('[data-status="success"]')
    .contains('Bankrekening')
    .should('be.visible');
  
  // Delete department
  cy.url().should('include', '/afdelingen/');  
  cy.get('[data-test="menuDepartment"]')
    .click();
  cy.get('[data-test="menuDepartment.delete"]')
    .click();
  cy.get('[data-test="modalDepartment.delete"]')
    .click();
  
  // Check success message
  cy.get('[data-status="success"]')
    .contains('Afdeling')
    .should('be.visible');

  cy.url().should('include', '/organisaties/');  

  // Delete organization
  cy.waitForReact();
  cy.get('[data-test="menuOrganization"]')
    .click();
  cy.waitForReact();
  cy.get('[data-test="menuOrganization.delete"]')
    .click();
  cy.waitForReact();
  cy.get('[data-test="buttonModal.delete"]')
    .click();
  cy.waitForReact();
  
  // Check success message
  cy.get('[data-status="success"]')
    .contains('Organisatie')
    .should('be.visible');

});

After({ tags: "@cleanupOrganizationDepartmentPostaddressBankaccount", order: 9999 }, function ()  {

  cy.visit('/organisaties');
  cy.waitForReact();
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
  cy.get('[data-status="success"]')
    .contains('Bankrekening')
    .should('be.visible');
  
  // Delete post address
  cy.get('[data-test="departmentPostaddress.delete"]')
    .click();
  cy.get('[data-test="modalPostaddress.delete"]')
    .click();

  // Check success message
  cy.get('[data-status="success"]')
    .contains('Postadres')
    .should('be.visible');

  // Delete department
  cy.url().should('include', '/afdelingen/');  
  cy.get('[data-test="menuDepartment"]')
    .click();
  cy.get('[data-test="menuDepartment.delete"]')
    .click();
  cy.get('[data-test="modalDepartment.delete"]')
    .click();
  
  // Check success message
  cy.get('[data-status="success"]')
    .contains('Afdeling')
    .should('be.visible');

  cy.url().should('include', '/organisaties/');  

  // Delete organization
  cy.waitForReact();
  cy.get('[data-test="menuOrganization"]')
    .click();
  cy.waitForReact();
  cy.get('[data-test="menuOrganization.delete"]')
    .click();
  cy.waitForReact();
  cy.get('[data-test="buttonModal.delete"]')
    .click();
  cy.waitForReact();
  
  // Check success message
  cy.get('[data-status="success"]')
    .contains('Organisatie')
    .should('be.visible');

});
