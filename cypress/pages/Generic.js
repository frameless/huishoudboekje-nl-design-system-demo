
class Generic {

  visit(url) {
    cy.visit(url)
  }

  notificationSuccess(text) {
    // Assertion
    cy.get('[data-status="success"]', { timeout: 10000 })
      .should('contain', text)
      .and('be.visible')

    // Make sure notification has disappeared from view
    cy.get('[data-status="success"]', { timeout: 10000 })
      .should('not.exist');
  }

  notificationError(text) {
    // Assertion
    cy.get('[data-status="error"]', { timeout: 10000 })
      .should('contain', text)
      .and('be.visible');

    // Make sure notification has disappeared from view
    cy.get('[data-status="error"]', { timeout: 10000 })
      .should('not.exist');
  }

  containsText(text) {
    cy.contains(text);
  }

  notContainsText(text) {
    cy.get('body', { timeout: 10000 })
      .should('not.contain', text);
  }
   
}

export default Generic;