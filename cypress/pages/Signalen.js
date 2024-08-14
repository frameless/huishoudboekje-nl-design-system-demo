
class Signalen {

    visit() {

      cy.visit("/signalen")

    }

    filterType() {

      return cy.get('#typeFilter', { timeout: 10000 })

    }

    notFilterType() {

      return cy.get('body', { timeout: 10000 }).not('#typeFilter')

    }
   
}

export default Signalen;