
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


When('I set the date range input "Periode" from 02-05-2024 up until 02-05-2024', () => {

  betaalinstructies.inputDateRangeStart('02-05-2024');
  betaalinstructies.inputDateRangeEnd('02-05-2024');

});


Given('no unprocessed payment instructions exist with an execution date on 02-05-2024', () => {

  generic.visit('/bankzaken/transacties');
  generic.containsText('Er zijn geen banktransacties gevonden');
 
});

Given("one citizen has an agreement and a payment instruction with an execution date set to 02-05-2024", () => {

  // Create agreement
  afspraakNew.createAfspraakUitgaven('Aaron Caronsson', '02-05-2024')
  generic.notificationSuccess('De afspraak is opgeslagen.')
  afspraakDetails.redirectToAfspraak()

  // Create payment instruction
  betaalinstructieNew.createBetaalinstructieMaandelijks()
  afspraakDetails.redirectToAfspraak()
  generic.containsText('Elke maand op de 2e')
  generic.containsText('Vanaf 02-05-2024 t/m ∞')

});

Given("another citizen has 2 agreements and payment instructions with an execution date set to 02-05-2024", () => {

  // Create agreement 1
  afspraakNew.createAfspraakUitgaven('Babette Aobinsson', '02-05-2024')
  generic.notificationSuccess('De afspraak is opgeslagen.')
  afspraakDetails.redirectToAfspraak()

  // Create payment instruction 1
  betaalinstructieNew.createBetaalinstructieMaandelijks()
  afspraakDetails.redirectToAfspraak()
  generic.containsText('Elke maand op de 2e')
  generic.containsText('Vanaf 02-05-2024 t/m ∞')

  // Create agreement 2
  afspraakNew.createAfspraakUitgaven('Babette Aobinsson', '02-05-2024')
  generic.notificationSuccess('De afspraak is opgeslagen.')
  afspraakDetails.redirectToAfspraak()

  // Create payment instruction 2
  betaalinstructieNew.createBetaalinstructieMaandelijks()
  afspraakDetails.redirectToAfspraak()
  generic.containsText('Elke maand op de 2e')
  generic.containsText('Vanaf 02-05-2024 t/m ∞')

});

// Scenario: view total number

Then('the total number of payment instructions is 3', () => {

  betaalinstructies.paymentInstructionsAmount(3);
 
});

Then('the selected amount of payment instructions is 3 out of 3', () => {

  betaalinstructies.textAmountSelected().contains('3 / 3');
 
});
