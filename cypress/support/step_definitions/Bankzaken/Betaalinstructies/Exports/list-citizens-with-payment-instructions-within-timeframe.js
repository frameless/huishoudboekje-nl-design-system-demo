
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

// Scenario: select payment instructions for default date

Given("two citizens have a payment instruction set to 02-05-2024", () => {

  // Create agreement
  afspraakNew.createAfspraakUitgaven('Caronsson', '2024-05-02')

  // Create payment instruction
  betaalinstructieNew.createBetaalinstructieMaandelijks()
  afspraakDetails.redirectToAfspraak()
  generic.containsText('Elke maand op de 2e')
  generic.containsText('Vanaf 02-05-2024 t/m ∞')

  // Create agreement
  afspraakNew.createAfspraakUitgaven('Aobinsson', '2024-05-02')

  // Create payment instruction
  betaalinstructieNew.createBetaalinstructieMaandelijks()
  afspraakDetails.redirectToAfspraak()
  generic.containsText('Elke maand op de 2e')
  generic.containsText('Vanaf 02-05-2024 t/m ∞')

});

When("one citizen has a payment instruction set to 03-05-2024", () => {

  // Create agreement
  afspraakNew.createAfspraakUitgaven('Bhailark', '2024-05-03')

  // Create payment instruction
  betaalinstructieNew.createBetaalinstructieMaandelijksSecond()
  afspraakDetails.redirectToAfspraak()
  generic.containsText('Elke maand op de 3e')
  generic.containsText('Vanaf 03-05-2024 t/m ∞')

});

Then('only the two citizens who have a payment instruction set to 02-05-2024 are displayed', () => {

  generic.containsText('Aaron Caronsson');
  generic.containsText('Babette Aobinsson');

  generic.notContainsText('Chip Bhailark');

});

// Scenario: select payment instructions for other date

Then('only the citizen who has a payment instruction set to 03-05-2024 is displayed', () => {

  generic.notContainsText('Aaron Caronsson');
  generic.notContainsText('Babette Aobinsson');
  generic.containsText('Chip Bhailark');

});

// Scenario: select payment instructions for multiple days

When('I set the date range input "Periode" from 02-05-2024 up until 03-05-2024', () => {

  betaalinstructies.inputDateRangeStart('02-05-2024');
  betaalinstructies.inputDateRangeEnd('03-05-2024');

});

Then('all three citizens are displayed', () => {

  generic.containsText('Aaron Caronsson');
  generic.containsText('Babette Aobinsson');
  generic.containsText('Chip Bhailark');

});