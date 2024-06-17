
import { Given, When, Then, Step, DataTable } from "@badeball/cypress-cucumber-preprocessor";

const header = {
  'content-type': 'application/json',
  'Accept-Encoding': 'gzip, deflate, br',
};

//#region - Scenario: save default alarm days deviation

Then('the "Toegestane afwijking dag" field is set to {string}', (number) => {

  // Check 'Toegestane afwijking dag' field  
  cy.get('[data-test="alarmForm.dateMargin"]', { timeout: 10000 })
    .should('have.value', number)

});

//#endregion