
import Api from "./Api";

const api = new Api()


class Organisaties {

    visit() {
      cy.visit("/organisaties")
      cy.url().should('eq', Cypress.config().baseUrl + '/organisaties');
    }

    correctUrl(){
      cy.url().should('eq', Cypress.config().baseUrl + '/organisaties');
    }

    buttonToevoegen() {
      return cy.get('button').contains('Toevoegen')
    }

    panelOrganisatie(organisatieNaam) {
      return cy.get('p[title="'+ organisatieNaam +'"]')
    }

    searchOrganisatie(organisatieNaam) {
      cy.get('[data-test="input.searchOrganisatie"]').type(organisatieNaam)
    }

}

export default Organisaties;