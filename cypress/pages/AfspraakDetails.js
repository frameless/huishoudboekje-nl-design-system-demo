
class AfspraakDetails {
   
  getAlarm() {
    cy.contains('Elke maand op de 1e');

    // Check current status of alarm
    cy.get('.chakra-switch__track');
    cy.get('.chakra-switch__thumb');
    cy.get('[data-checked=""]');
  }

  readAlarm() {
    cy.contains('Periodiek');
    cy.contains('op de 1e');
    cy.contains('+1 dag');
    cy.contains('Volgende periodieke check')
    cy.contains('+/- € ')
    cy.get('label[class^="chakra-switch"]')
      .should('be.visible')
  }

	buttonToevoegen() {
		return cy.get('button').contains('Toevoegen')
	}

  toggleAlarmStatus() {
    return cy.get('input[type="checkbox"]', { timeout: 10000 })
  }

  toggleGetStatusDisabled() {
    return cy.get('label[data-checked]', { timeout: 10000 })
  }

  toggleGetStatusEnabled() {
    return cy.get('label[class^="chakra-switch"]', { timeout: 10000 })
  }

  buttonBetaalinstructieToevoegen()
  {
    return cy.get('[data-test="section.paymentInstruction"]')
      .find('button')
      .contains('Toevoegen')
  }

  buttonDeleteAlarm() {
    return cy.get('button[aria-label="Verwijderen"]', { timeout: 10000 })
  
  }

  redirectToAfspraak()
  {
    cy.url().should('include', Cypress.config().baseUrl + '/afspraken/', { timeout: 10000 });
  }

  redirectToBetaalinstructie()
  {
    cy.url().should('include', '/betaalinstructie', { timeout: 10000 });
  }

}

export default AfspraakDetails;