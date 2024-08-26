import Generic from "./Generic";
import Api from "./Api";

const generic = new Generic()
const api = new Api()

let afspraakName = 0;

class BurgersDetails {

	insertAfspraak(burgerId) {
		
		const queryAddAfspraak = `mutation createAfspraak {
			createAfspraak(input:
			{
			burgerId: `+ burgerId +`,
			tegenRekeningId: 1,
			rubriekId: 5,
			omschrijving: "Test afspraak 1234",
			bedrag: 100.00,
			credit: false
				afdelingId : null,
				postadresId : null,
		}
		)
		{
			ok,
			afspraak{omschrijving}
		}
		}`
		
		// Create afspraak
		cy.request({
			method: "post",
			url: Cypress.config().baseUrl + '/apiV2/graphql',
			body: { query: queryAddAfspraak },
		}).then((res) => {
			console.log(res.body);
			afspraakName = res.body.data.createAfspraak.afspraak.omschrijving;
			console.log('Test afspraak has been created with name ' + afspraakName)
		});
	}
	
	addAfspraak(agreementName) {

		// Already on correct page, so click 'Toevoegen' button
		this.buttonToevoegen().click();
		
		// Add agreement with test department
		cy.url().should('contains', '/afspraken/toevoegen'); 
		cy.get('[data-test="radio.agreementOrganization"]')
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
		cy.get('[data-test="radio.agreementIncome"]')
			.click();
		cy.get('#rubriek')
			.click()
			.contains('Toeslagen')
			.click();
		cy.get('[data-test="select.agreementIncomeDescription"]')
			.type(agreementName);
		cy.get('[data-test="select.agreementIncomeAmount"]')
			.type('10');
		cy.get('[data-test="button.Submit"]')
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
			.find('a[aria-label="Bekijken"]:visible')
			.click();
		cy.url().should('include', Cypress.config().baseUrl + '/afspraken/')
	}

	viewLatestAfspraak() {
		cy.get('tbody')
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
			.find('a[aria-label="Bekijken"]:visible')
			.click();
		cy.url().should('include', Cypress.config().baseUrl + '/afspraken/')
	}

	viewAfspraakByEntry(entryNumber) {
		cy.get('a[aria-label="Bekijken"]:visible')
			.eq(entryNumber)
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

	getMenu() {
		return cy.get('[data-test="kebab.citizen"]')
	}

	menuEndCitizen() {
		return cy.get('[data-test="agreement.menuEnd"]')
	}

	endCitizenDateField() {
		return cy.get('[data-test="input.endDate"]')
	}

	endCitizenConfirm() {
		return cy.get('[data-test="button.endModal.confirm"]')
	}

	endCitizenWarnConfirm() {
		return cy.get('[data-test="button.warnModal.confirm"]')
	}
  
   
}

export default BurgersDetails;