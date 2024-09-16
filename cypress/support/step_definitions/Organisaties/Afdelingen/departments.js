// cypress/support/step_definitions/Organisaties/organisations.js

import { Given, When, Then, Step } from "@badeball/cypress-cucumber-preprocessor";
import Generic from "../../../../pages/Generic";
import Organisaties from "../../../../pages/Organisaties";
import OrganisatieNew from "../../../../pages/OrganisatieNew";
import OrganisatieDetails from "../../../../pages/OrganisatieDetails";
import AfdelingDetails from "../../../../pages/AfdelingDetails";
 
const generic = new Generic()
const organisaties = new Organisaties()
const organisatieNew = new OrganisatieNew()
const organisatieDetails = new OrganisatieDetails()
const afdelingDetails = new AfdelingDetails()

let uniqueIdOrganisation = 0;
let uniqueIdDepartment = 0;

//#region Scenario: create a department

When("I navigate to the test organisation's page", () => {

    // Add an organisation
    uniqueIdOrganisation = Date.now().toString();

    organisatieNew.visit();
    organisatieNew.inputKvK().type('12345678');
    organisatieNew.inputVestigingsnummer().type('123456789012');
    organisatieNew.inputBedrijfsnaam().type(uniqueIdOrganisation);
    organisatieNew.buttonOpslaan().click();
    generic.notificationSuccess('organisatie opgeslagen')

});

Then("I add a department", () => {

    // Add a department
    uniqueIdDepartment = Date.now().toString();

    organisatieDetails.buttonAfdelingToevoegen().click();
    organisatieDetails.inputAfdelingNaam().type(uniqueIdDepartment)
    organisatieDetails.modalOpslaan().click();
    generic.notificationSuccess('Nieuwe afdeling opgeslagen')

});

Then("the department is created", () => {

    generic.containsText(uniqueIdDepartment);

});

//#endregion

//#region Scenario: edit a department to have a postal address and IBAN

When("I add a postal address and IBAN to the department", () => {

    // Navigate to correct organisatie
    organisaties.visit()
    organisaties.searchOrganisatie(uniqueIdOrganisation)
    organisaties.panelOrganisatie(uniqueIdOrganisation).click();

    // Navigate to correct afdeling
    organisatieDetails.panelAfdeling(uniqueIdDepartment).click();

    // Add postal address
    afdelingDetails.buttonPostadresToevoegen().click();
    afdelingDetails.inputPostadresStraatnaam().type('Söder Mälarstrand');
    afdelingDetails.inputPostadresHuisnummer().type('43');
    afdelingDetails.inputPostadresPostcode().type('1234AB');
    afdelingDetails.inputPostadresPlaatsnaam().type('Stockholm');
    afdelingDetails.modalOpslaan().click();
    generic.notificationSuccess('Postadres toegevoegd');

    // Add IBAN
    afdelingDetails.buttonRekeningToevoegen().click();
    afdelingDetails.inputRekeningRekeninghouder().should('have.value', uniqueIdDepartment);
    afdelingDetails.inputRekeningIBAN().type('NL11VOWA0398683441');
    afdelingDetails.modalOpslaan().click();
    generic.notificationSuccess('Bankrekening NL11VOWA0398683441 op naam van');

});

Then("the department has a postal address and an IBAN", () => {

    // Postal address
    generic.containsText('Söder Mälarstrand');
    generic.containsText('Stockholm');

    // IBAN
    generic.containsText('Rekeninghouder');
    generic.containsText('NL11 VOWA 0398 6834 41');

});

//#endregion

//#region Scenario: delete a department with postal address and IBAN

When("I delete the department", () => {

    // Navigate to correct organisatie
    organisaties.visit()
    organisaties.searchOrganisatie(uniqueIdOrganisation)
    organisaties.panelOrganisatie(uniqueIdOrganisation).click();

    // Navigate to correct afdeling
    organisatieDetails.panelAfdeling(uniqueIdDepartment).click();

    afdelingDetails.menu().click();
    afdelingDetails.menuVerwijderen().click();
    afdelingDetails.modalVerwijderen().click();

});

Then("the department is not deleted", () => {

    generic.containsText(uniqueIdDepartment);

});

//#endregion

//#region Scenario: delete an empty department

Given("there are no postal addresses or IBANs associated with the department", () => {

    // Navigate to correct organisatie
    organisaties.visit()
    organisaties.searchOrganisatie(uniqueIdOrganisation)
    organisaties.panelOrganisatie(uniqueIdOrganisation).click();

    // Navigate to correct afdeling
    organisatieDetails.panelAfdeling(uniqueIdDepartment).click();

    // Delete postal address
    afdelingDetails.buttonPostadresVerwijderen().click();
    afdelingDetails.modalPostadresVerwijderen().click();
    generic.notificationSuccess('Postadres verwijderd');

    // Delete IBAN
    afdelingDetails.buttonIBANVerwijderen().click();
    afdelingDetails.modalIBANVerwijderen().click();
    generic.notificationSuccess('Bankrekening is verwijderd.');

});

Then("the department is deleted", () => {

    generic.notificationSuccess('Afdeling ' + uniqueIdDepartment + ' verwijderd')
    organisatieDetails.panelAfdeling(uniqueIdDepartment).should('not.exist');

    // Clean up (delete organisation)
    organisatieDetails.menu().click();
    organisatieDetails.menuVerwijderen().click();
    organisatieDetails.modalVerwijderen().click();

    generic.notificationSuccess('Organisatie is verwijderd');

});

//#endregion