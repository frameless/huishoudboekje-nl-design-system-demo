import Generic from "./Generic";
import BurgersDetails from "./BurgerDetails";
import Burgers from "./Burgers";

const generic = new Generic()
const burgers = new Burgers()
const burgerDetails = new BurgersDetails()

const uniqueSeed = Date.now().toString();

class AfspraakNew {
   
  radioOrganisatie()
  {
    return cy.get('[data-test="radio.agreementOrganization"]')
  }

  inputOrganisatie()
  {
    return cy.get('#organisatie')
  }

  inputTegenrekening()
  {
    return cy.get('#tegenrekening')
  }

  radioInkomen()
  {
    return cy.get('[data-test="radio.agreementIncome"]')
  }

  radioUitgaven()
  {
    return cy.get('[data-test="radio.agreementExpense"]')
  }

  inputRubriek()
  {
    return cy.get('#rubriek')
  }

  inputInkomenBeschrijving()
  {
    return cy.get('[data-test="select.agreementIncomeDescription"]')
  }

  inputInkomenAmount()
  {
    return cy.get('[data-test="select.agreementIncomeAmount"]')
  }

  inputStartDate()
  {
    return cy.get('[data-test="input.startDate"]')
  }

  buttonOpslaan()
  {
    return cy.get('[data-test="button.Submit"]')
  }

  addAfspraak(agreementName) {

		// Already on correct page, so click 'Toevoegen' button
		burgerDetails.buttonAfspraakToevoegen().click();
		
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
		generic.notificationSuccess('De afspraak is opgeslagen');

	}

  createAfspraakInkomen(burger) {

    burgerDetails.insertAfspraak(burger, uniqueSeed, '543.54', 'NL09INGB4826953240', '1', 'true', '2024-01-01');

    // View burger detail page
    burgers.openBurger(burger)
    burgerDetails.viewAfspraak(uniqueSeed)

  }

  createAfspraakUitgaven(burger, date) {

    burgerDetails.insertAfspraak(burger, 'Maandelijks leefgeld HHB000003', '543.21', 'NL09INGB4826953240', '11', 'false', date)

    // View burger detail page
    burgers.openBurger(burger)
    burgerDetails.viewAfspraak('Maandelijks leefgeld HHB000003')
    
  }

}

export default AfspraakNew;