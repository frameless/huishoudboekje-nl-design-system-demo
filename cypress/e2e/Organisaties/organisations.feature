# cypress/e2e/Organisaties

Feature: create, edit and delete an organisation

  # Create a new organisation, edit it and then delete it.

  Background:
    # Given I am logged in as an authorised site user

  Scenario: create an organisation
    When I add an organisation
    Then the organisation is created

  @skip
  Scenario: edit an organisation to use an existing vestigingsnummer
    When I edit the organisation to use an existing vestigingsnummer
    And I save the changes I made to the organisation
    Then an error notification containing 'Er bestaat al een organisatie met dit KvK-nummer en vestigingsnummer' is displayed

  Scenario: edit an organisation's company name
    When I change the company name of the organisation
    And I save the changes I made to the organisation
    Then the organisation is saved and the changes are displayed

  Scenario: delete an organisation without departments
    When I delete the organisation
    Then the organisation is deleted
