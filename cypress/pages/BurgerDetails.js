import Generic from "./Generic";
import Api from "./Api";

const generic = new Generic()
const api = new Api()

let afspraakName = 0;

class BurgersDetails {

	// Bedrag
		// Notitie: 100.00

	// Rubrieken:
		// 1: Inkomsten + CREDIT
		// 2: Toeslagen + CREDIT
		// 3: Uitkeringen + CREDIT
		// 4: Subsidies + CREDIT
		// 5: Huur of hypotheek - DEBET
		// 6: Gas en elektriciteit - DEBET
		// 7: Water - DEBET
		// 8: Lokale lasten - DEBET
		// 9: Telefoon, internet en televisie - DEBET
		// 10: Verzekeringen - DEBET
		// 11: Privé-opname - DEBET
	
	// Tegenrekening id 1: Belastingdienst NL86INGB0002445588

	insertAfspraak(burgerAchternaam, omschrijving, bedrag, IBAN, rubriek, isCreditTrue, date) {

		// Get burger id
		api.getBurgerId(burgerAchternaam).then((res) => {
			console.log(res);	
			cy.log('Test citizen has id ' + res.data.burgers[0].id)
			let burgerId = res.data.burgers[0].id;

			api.getAfdelingId(IBAN).then((res) => {
				console.log(res);	
				cy.log('Test afdeling has id ' + res.data.afdelingenByIban[0].id)
				let afdelingId = res.data.afdelingenByIban[0].id;
				let tegenRekeningId = res.data.rekeningenByIbans[0].id;
				if (afdelingId == null)
				{
					const queryAddAfspraak = `mutation createAfspraak {
						createAfspraak(input:
						{
						burgerId: `+ burgerId +`,
						tegenRekeningId: `+ tegenRekeningId +`,
						rubriekId: `+ rubriek +`,
						omschrijving: "`+ omschrijving +`",
						bedrag: `+ bedrag +`,
						credit: `+ isCreditTrue +`,
						validFrom: "`+ date +`",
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
				else
				{				

				api.getPostadresId(afdelingId).then((res) => {
					console.log(res);	
					cy.log('Test postadres has id ' + res.data.afdeling.postadressen[0].id)
					let postadresId = res.data.afdeling.postadressen[0].id;

					const queryAddAfspraak = `mutation createAfspraak {
						createAfspraak(input:
						{
						burgerId: `+ burgerId +`,
						tegenRekeningId: `+ tegenRekeningId +`,
						rubriekId: `+ rubriek +`,
						omschrijving: "`+ omschrijving +`",
						bedrag: `+ bedrag +`,
						credit: `+ isCreditTrue +`,
						validFrom: "`+ date +`",
							afdelingId : `+ afdelingId +`,
							postadresId : "`+ postadresId +`",
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
				});

				}
			});
		});
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

	buttonAfspraakToevoegen() {
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