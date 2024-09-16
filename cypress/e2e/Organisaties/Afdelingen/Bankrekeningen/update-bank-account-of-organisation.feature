# cypress/e2e/Bank statements/Bank accounts/update-bank-account-of-organisation.feature

@bankservice
Feature: update bank account of organisation

  # Update a bank account of a department of an organisation.

  Background:
    # Given I am logged in as an authorised site user

  @cleanupOrganizationDepartmentBankaccount
  Scenario: view update bank account form
    When I view the "Organisation department" page
    Given 1 or more bank accounts exist
    When I click the "Edit bank account" button
    Then the "Edit bank account" modal opens
    Then the "Close modal" button is displayed
    Then the "Account holder" form field is displayed
    Then the "IBAN" form field is displayed 
    Then the "IBAN" form field is disabled 
    Then the "Cancel form" button is displayed
    Then the "Submit form" button is displayed
