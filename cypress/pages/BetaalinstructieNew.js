import Generic from "./Generic";
import BurgersDetails from "./BurgerDetails";
import Burgers from "./Burgers";
import AfspraakDetails from "./AfspraakDetails";

const generic = new Generic()
const burgers = new Burgers()
const burgerDetails = new BurgersDetails()
const afspraakDetails = new AfspraakDetails();

const uniqueSeed = Date.now().toString();

class BetaalinstructieNew {
   
  redirectToBetaalinstructie()
  {
    cy.url().should('include', Cypress.config().baseUrl + '/afspraken/', { timeout: 10000 });
    cy.url().should('include', Cypress.config().baseUrl + '/betaalinstructie', { timeout: 10000 });
  }

  radioEenmalig()
  {
    return cy.get('[data-test="radio.once"]')
  }

  radioHerhalend()
  {
    return cy.get('[data-test="radio.periodically"]')
  }

  inputStartdatum()
  {
    return cy.get('[data-test="input.startDate"]')
  }

  inputEinddatum()
  {
    return cy.get('[data-test="input.endDate"]')
  }

  inputHerhalingMaandelijks()
  {
    cy.get('[data-test="select.repeat"]')
      .find('input')
      .type('Maand')
    cy.contains('Maandelijks')
      .click();
  }

  inputDagvdMaand()
  {
    return cy.get('[data-test="input.byMonthDay"]')
  }

  buttonOpslaan()
  {
    return cy.get('[data-test="button.Submit"]')
  }
  
  createBetaalinstructieMaandelijks()
  {
    afspraakDetails.buttonBetaalinstructieToevoegen().click();
    afspraakDetails.redirectToBetaalinstructie()
    this.radioHerhalend().click();
    this.inputStartdatum().type('02-05-2024{enter}');
    this.inputHerhalingMaandelijks()
    this.inputDagvdMaand().type('{selectAll}2{enter}');
    this.buttonOpslaan().click();
    generic.notificationSuccess('De betaalinstructie is ingesteld.')
  }

  createBetaalinstructieMaandelijksSecond()
  {
    afspraakDetails.buttonBetaalinstructieToevoegen().click();
    afspraakDetails.redirectToBetaalinstructie()
    this.radioHerhalend().click();
    this.inputStartdatum().type('03-05-2024{enter}');
    this.inputHerhalingMaandelijks()
    this.inputDagvdMaand().type('{selectAll}3{enter}');
    this.buttonOpslaan().click();
    generic.notificationSuccess('De betaalinstructie is ingesteld.')
  }

}

export default BetaalinstructieNew;