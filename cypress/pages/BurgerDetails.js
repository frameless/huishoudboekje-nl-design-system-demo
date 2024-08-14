import Generic from "./Generic";

const generic = new Generic()

class BurgersDetails {

	insertAfspraak(citizen) {
			// Back end
	}
	
	addAfspraak(agreementName) {

		// Already on correct page, so click 'Toevoegen' button
		this.buttonToevoegen().click();
		
		// Add agreement with test department
		cy.url().should('contains', '/afspraken/toevoegen'); 
		cy.get('[data-test="radio.agreementOrganization"]', { timeout: 10000 })
			.click();
		cy.get('#organisatie')
			.type('Belast');
		cy.contains('ingdienst')
			.click();
		// Check auto-fill
		cy.contains('Graadt van Roggenweg');
		// Fill in IBAN
		cy.get('#tegenrekening')
			.type('NL86');
		cy.contains('0002 4455')
			.click();
		
		// Payment direction: Toeslagen
		cy.get('[data-test="radio.agreementIncome"]', { timeout: 10000 })
			.click();
		cy.get('#rubriek')
			.click()
			.contains('Toeslagen')
			.click();
		cy.get('[data-test="select.agreementIncomeDescription"]', { timeout: 10000 })
			.type(agreementName);
		cy.get('[data-test="select.agreementIncomeAmount"]', { timeout: 10000 })
			.type('10');
		cy.get('[data-test="button.Submit"]', { timeout: 10000 })
			.click();
		
		// Check redirect
		cy.url({ timeout: 10000 }).should('not.include', '/toevoegen')
		
		// Check success message
		generic.notificationSuccess('afspraak');

	}

	viewAfspraak(agreementName) {
		cy.contains(agreementName)
			.parent()
			.parent()
			.next()
			.find('a[aria-label="Bekijken"]:visible')
			.click();
		cy.url().should('include', Cypress.config().baseUrl + '/afspraken/')
	}

	viewLatestAfspraak() {
		cy.get('tbody', { timeout: 10000 })
			.find('tr')
			.last()
			.children()
			.last()
			.find('a[aria-label="Bekijken"]:visible')
			.click();
  	cy.url().should('contains', Cypress.config().baseUrl + '/afspraken/')
	}

	viewAfspraakByAmount(agreementAmount) {
		cy.contains(agreementAmount)
			.parent()
			.parent()
			.next()
			.find('a[aria-label="Bekijken"]:visible')
			.click();
		cy.url().should('include', Cypress.config().baseUrl + '/afspraken/')
	}

	buttonToevoegen() {
		return cy.get('[data-test="button.Add"]')
	}

	sectionBalance() {
		return cy.get('[data-test="citizen.sectionBalance"]')
	}

	balance() {
		return cy.get('[data-test="citizen.balance"]')
	}

	toggleNegativeBalance() {
		return cy.get('[data-test="citizen.toggleNegativeBalance"]')
	}

	toggleNegativeBalanceEnabled() {
		return cy.get('[data-test="citizen.sectionBalance"]').find('label[class^="chakra-switch"]')
	}

	toggleNegativeBalanceDisabled() {
		return cy.get('[data-test="citizen.sectionBalance"]', { timeout: 10000 }).find('input[type="checkbox"]')
	}

	
   
}

export default BurgersDetails;