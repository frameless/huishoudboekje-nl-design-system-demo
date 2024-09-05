
import Api from "./Api";

const api = new Api()


class Burgers {

    visit() {
      cy.visit("/burgers")
    }
   
    search(text) {
      return cy .get('input[placeholder="Zoeken"]')
                .type(text)
    }

    findBurger(text)
    {
      return cy.get('[data-test="citizen.tile"]').contains(text)
    }

    viewBurger(fullName)
    {
      // Function that splits last name from other names
      function lastName(fullName) {
        var n = fullName.split(" ");
        return n[n.length - 1];
      }

      let searchTerm = lastName(fullName)

      cy.visit('/burgers');
      cy.url().should('eq', Cypress.config().baseUrl + '/burgers')
      cy.get('input[placeholder="Zoeken"]')
        .type(searchTerm);
      cy.get('[data-test="citizen.tile"]', { timeout: 30000 })
        .should('be.visible')
        .first()
        .click();
      cy.url().should('include', Cypress.config().baseUrl + '/burgers/')
    }

    openBurger(fullName)
    {
      // Function that splits last name from other names
      function lastName(fullName) {
        var n = fullName.split(" ");
        return n[n.length - 1];
      }

      let achternaam = lastName(fullName)

      api.getBurgerId(achternaam).then((res) => {
        console.log(res);	
        cy.log('Test citizen has id ' + res.data.burgers[0].id)
        let burgerId = res.data.burgers[0].id;
        cy.visit('/burgers/' + burgerId);
        cy.url().should('eq', Cypress.config().baseUrl + '/burgers/' + burgerId)
      });
    }

    
}

export default Burgers;