# cypress/e2e/Organisaties/Afdelingen

Feature: create, edit and delete a department

  # Create a new department, edit it and then delete it.

  Background:
    # Given I am logged in as an authorised site user
    # Given a test organisation is created

  Scenario: create a department
    When I navigate to the test organisation's page
    And I add a department
    Then the department is created

  Scenario: edit a department to have a postal address and IBAN
    When I add a postal address and IBAN to the department
    Then the department has a postal address and an IBAN

  Scenario: delete a department with postal address and IBAN
    When I delete the department
    Then an error notification containing 'Afdeling has postadressen - deletion is not possible' is displayed
    And the department is not deleted

  Scenario: delete an empty department
    Given there are no postal addresses or IBANs associated with the department
    When I delete the department
    Then the department is deleted

