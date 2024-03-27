# cypress/e2e/Bank statements/Bank accounts/create-bank-account-for-organisation.feature

@bankservice 
Feature: create bank account for organisation

  # Create a bank account for a department of an organisation.

  Background:
    # Given I am logged in as an authorised site user

  @cleanupOrganizationDepartment
  Scenario: view create bank account form
    When I view the "Organisation department" page
    When I click the "Add bank account" button
    Then the "Add bank account" modal opens
    Then the "Close modal" button is displayed
    Then the "Account holder" form field is displayed
    Then the "IBAN" form field is displayed
    Then the "Cancel form" button is displayed
    Then the "Submit form" button is displayed

  @cleanupOrganizationDepartmentBankaccount
  Scenario: save bank account
    When I view the "Organisation department" page
    When I click the "Add bank account" button
    Then I view the "Add bank account" modal
    When I fill in the "Account holder" form field
    When I fill in the "IBAN" form field
    When I click the "Save" button
    Then the "Add bank account" modal is closed
    Then a notification of success is displayed
    Then the bank account is displayed
