
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

Then('I set the date range input "Periode" from 03-05-2024 up until 03-05-2024', () => {

  betaalinstructies.inputDateRangeStart('03-05-2024');
  betaalinstructies.inputDateRangeEnd('03-05-2024');

});