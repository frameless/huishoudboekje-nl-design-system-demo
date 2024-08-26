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
  
  createAfspraakInkomen(burger) {

    // Navigate to test citizen's overview page
    burgers.viewBurger(burger)
    burgerDetails.buttonToevoegen().click();

    // Add agreement with test department
    cy.url().should('contains', '/afspraken/toevoegen'); 
    this.radioOrganisatie().click();
    this.inputOrganisatie().type('Albert');
    generic.containsText('Heijn').click();

    // Check auto-fill
    generic.containsText('Zaandam');

    // Fill in IBAN
    this.inputTegenrekening().type('NL09');
    generic.containsText('9532').click();

    // Payment direction: Inkomsten
    this.radioInkomen().click();
    this.inputRubriek()
        .click()
        .contains('Inkomsten')
        .click();
    this.inputInkomenBeschrijving().type(uniqueSeed);
    this.inputInkomenAmount().type('543.54');
    
    // Save
    this.buttonOpslaan().click();

  }

  createAfspraakUitgaven(burger, date) {

    // Navigate to test citizen's overview page
    burgers.viewBurger(burger)
    burgerDetails.buttonToevoegen().click();

    // Add agreement with test department
    cy.url().should('contains', '/afspraken/toevoegen'); 
    this.radioOrganisatie().click();
    this.inputOrganisatie().type('Gemeente');
    generic.containsText('Utrecht').click();

    // Check auto-fill
    generic.containsText('16200');

    // Fill in IBAN
    this.inputTegenrekening().type('NL49');
    generic.containsText('0285 1717').click();

    // Payment direction: Uitgaven
    this.radioUitgaven().click();
    this.inputRubriek()
        .click()
        .contains('Privé-opname')
        .click();
    this.inputInkomenBeschrijving().type('Maandelijks leefgeld HHB000003');
    this.inputInkomenAmount().type('543.21');
    this.inputStartDate().type('{selectAll}' + date + '{enter}');

    // Save
    this.buttonOpslaan().click();
    
  }


}

export default AfspraakNew;