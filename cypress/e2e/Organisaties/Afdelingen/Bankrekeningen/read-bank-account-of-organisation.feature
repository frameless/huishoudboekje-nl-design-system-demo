# cypress/e2e/Bank statements/Bank accounts/read-bank-account-of-organisation.feature

@bankservice
Feature: read bank account of organisation

  # Read properties of a bank account of a department of an organisation.

  Background:
    # Given I am logged in as an authorised site user

  Scenario: no bank account
    When I view the "Organisation department" page
    Given no bank account exists
    Then no bank account is displayed
    Then the "Add bank account" button is displayed

  @cleanupOrganizationDepartment @cleanupOrganizationDepartmentBankaccount
  Scenario: bank account exists
    When I view the "Organisation department" page
    Given 1 or more bank accounts exist
    Then the "Account holder" is displayed
    Then the "IBAN" is displayed
    Then the "Edit bank account" button is displayed
    Then the "Add bank account" button is displayed

