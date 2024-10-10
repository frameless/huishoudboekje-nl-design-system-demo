
class Betaalinstructies {

    // Setup
  
    visit()
    {
      cy.visit('/bankzaken/betaalinstructies')
    }
  
    visitToevoegen()
    {
      cy.visit('/bankzaken/betaalinstructies/toevoegen')
    }

    redirectBetaalinstructies()
    {
        cy.url().should('eq', Cypress.config().baseUrl + '/bankzaken/betaalinstructies')
    }

    redirectBetaalinstructieDetails()
    {
        cy.url().should('include', Cypress.config().baseUrl + '/bankzaken/betaalinstructies/exports/')
    }
  
    inputDateRangeStart(date)
    {
      cy.get('[data-test="input.dateRange.start"]')
        .type('{selectAll}' + date + '{enter}');
      cy.get('[data-test="skeleton"]', { timeout: 10000 })
        .should('not.exist');
      cy.wait(500);
    }
  
    inputDateRangeEnd(date)
    {
      cy.get('[data-test="input.dateRange.end"]')
        .type('{selectAll}' + date + '{enter}');
      cy.get('[data-test="skeleton"]', { timeout: 10000 })
        .should('not.exist');
      cy.wait(500);
    }

    textAmountSelected()
    {
      return cy.get('[data-test="text.amountSelected"]')
    }
  
    buttonSelectieAanpassen()
    {
      return cy.get('[data-test="button.editSelection"]')
    }
  
    buttonSelecteerAlles()
    {
      return cy.get('[data-test="button.selectAll"]')
    }

    buttonViewInstruction(instructionNumber)
    {
        return cy.get('[data-test="button.View"]').eq(instructionNumber);
    }
  
    toggleAll()
    {
      return cy.get('[data-test="checkbox.toggleAll"]')
    }
  
    buttonExport()
    {
      return cy.get('[data-test="buttonModal.submit"]')
    }

    modalExportBevestigen() {
      return cy.get('[data-test="buttonModal.confirmSubmit"]')
    }
  
    paymentInstruction(number)
    {    
      return cy.get('[data-test="expand.instructionListItem"]').eq(number);
    }
  
    paymentInstructionsAmount(number)
    {    
      cy.get('[data-test="expand.instructionListItem"]')
        .should('have.length', number);
    }
  
    getCheckbox(number)
    {
      return  cy.get('[data-test="expand.instructionListItem"]').eq(number)
                .find('input[type="checkbox"]')
    }
  
    sortbyFirstName()
    {
      cy.get('[data-test="sorting.firstname"]')
        .click();
    }
  
    sortbyLastName()
    {
      cy.get('[data-test="sorting.lastname"]')
        .click();
    }
  
    sortbyStartDate()
    {
      cy.get('[data-test="sorting.startdate"]')
        .click();
    }
  
    isCheckboxToggled(number)
    {
      cy.get('input[type="checkbox"]')
        .eq(number)
        .parent()
        .should('not.have.prop', 'data-checked');
    }
  
    addCitizenToFilter(name)
    {
      cy.contains('Alle burgers')
        .click();
      cy.contains(name)
        .click();
    }
    goToPrevPage()
    {
      cy.contains('Vorige')
        .click();
    }
  
    goToNextPage()
    {
      cy.contains('Volgende')
        .click();
    }
       
}

export default Betaalinstructies;
