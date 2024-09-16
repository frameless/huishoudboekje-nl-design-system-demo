
import { Given, When, Then, Step, DataTable } from "@badeball/cypress-cucumber-preprocessor";
import Generic from "../../../../../pages/Generic";
import Betaalinstructies from "../../../../../pages/Betaalinstructies";
import BetaalinstructieNew from "../../../../../pages/BetaalinstructieNew";
import AfspraakDetails from "../../../../../pages/AfspraakDetails";
import AfspraakNew from "../../../../../pages/AfspraakNew";
import Burgers from "../../../../../pages/Burgers";

const generic = new Generic();
const betaalinstructies = new Betaalinstructies();
const betaalinstructieNew = new BetaalinstructieNew();
const afspraakDetails = new AfspraakDetails();
const afspraakNew = new AfspraakNew();
const burgers = new Burgers();

// Scenario: untoggle all checkboxes

Given('I have three citizens with payment instructions', () => {

  // Citizen One
    // Create agreement
    afspraakNew.createAfspraakUitgaven('Caronsson', '2024-05-02')
  
    // Create payment instruction
    betaalinstructieNew.createBetaalinstructieMaandelijks()
    afspraakDetails.redirectToAfspraak()
    generic.containsText('Elke maand op de 2e')
    generic.containsText('Vanaf 02-05-2024 t/m ∞')

  // Citizen Two
    // Create agreement
    afspraakNew.createAfspraakUitgaven('Aobinsson', '2024-05-02')
  
    // Create payment instruction
    betaalinstructieNew.createBetaalinstructieMaandelijks()
    afspraakDetails.redirectToAfspraak()
    generic.containsText('Elke maand op de 2e')
    generic.containsText('Vanaf 02-05-2024 t/m ∞')

  // Citizen Three
    // Create agreement
    afspraakNew.createAfspraakUitgaven('Bhailark', '2024-05-02')
  
    // Create payment instruction
    betaalinstructieNew.createBetaalinstructieMaandelijks()
    afspraakDetails.redirectToAfspraak()
    generic.containsText('Elke maand op de 2e')
    generic.containsText('Vanaf 02-05-2024 t/m ∞')

});

When('I have all payment instructions selected', () => {

  // All payments are selected by default
  betaalinstructies.paymentInstruction(0).click();
  betaalinstructies.getCheckbox(0).parent().should('have.attr', 'data-checked');

  betaalinstructies.paymentInstruction(1).click();
  betaalinstructies.getCheckbox(1).parent().should('have.attr', 'data-checked');

  betaalinstructies.paymentInstruction(2).click();
  betaalinstructies.getCheckbox(2).parent().should('have.attr', 'data-checked');
 
});

When('I untoggle all checkboxes', () => {

  betaalinstructies.toggleAll().click({ force: true});

});


Then('all payment instructions are deselected', () => {

  // All payments are deselected
  betaalinstructies.getCheckbox(0).parent().should('not.have.attr', 'data-checked');
  betaalinstructies.getCheckbox(1).parent().should('not.have.attr', 'data-checked');
  betaalinstructies.getCheckbox(2).parent().should('not.have.attr', 'data-checked');
 
});

// Scenario: toggle all checkboxes

Given('I have no payment instructions selected', () => {
  
  // Make test ready for execution
  Step(this, "I visit the 'Betaalinstructies Toevoegen' page");
  Step(this, 'I set the date range input "Periode" from 02-05-2024 up until 03-05-2024');
  Step(this, 'I untoggle all checkboxes');

  // All payments are deselected
  betaalinstructies.paymentInstruction(0).click();
  betaalinstructies.getCheckbox(0).parent().should('not.have.attr', 'data-checked');

  betaalinstructies.paymentInstruction(1).click();
  betaalinstructies.getCheckbox(1).parent().should('not.have.attr', 'data-checked');

  betaalinstructies.paymentInstruction(2).click();
  betaalinstructies.getCheckbox(2).parent().should('not.have.attr', 'data-checked');

});

When('I toggle all checkboxes', () => {

  betaalinstructies.toggleAll().click({ force: true});

});

Then('all payment instructions are selected', () => {

  // All payments are deselected
  betaalinstructies.getCheckbox(0).parent().should('have.attr', 'data-checked');
  betaalinstructies.getCheckbox(1).parent().should('have.attr', 'data-checked');
  betaalinstructies.getCheckbox(2).parent().should('have.attr', 'data-checked');
 
});

// Scenario: no checkbox checked when exporting

Given('all three payment instructions are selected', () => {
  
  // Make test ready for execution
  Step(this, "I visit the 'Betaalinstructies Toevoegen' page");
  Step(this, 'I set the date range input "Periode" from 02-05-2024 up until 02-05-2024');
  Step(this, 'I have all payment instructions selected');

});

When('the export button is disabled', () => {
  
  betaalinstructies.buttonExport().should('have.attr', 'disabled');

});