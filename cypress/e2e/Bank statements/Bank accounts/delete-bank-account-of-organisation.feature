# cypress/e2e/Bank statements/Bank accounts/delete-bank-account-of-organisation.feature

@bankservice 
Feature: delete bank account of organisation

  # Delete a bank account of a department of an organisation.

  Background:
    # Given I am logged in as an authorised site user
    # Given 1 or more bank accounts exist
  
  Scenario: bank account not used in journal entry
    When I view the "Organisation department" page
    Given the bank account is not applied to a journal entry
    When I click the "Delete bank account" button
    When I confirm by clicking the "Delete" button
    Then a notification of success is displayed
    Then the bank account "NL79KOEX0830642005" is not displayed

  @cleanupOrganizationDepartment @cleanupAgreement @cleanupOrganizationDepartmentPostaddressBankaccount
  Scenario: bank account used in journal entry
    When I view the "Organisation department" page
    Given the bank account is applied to a journal entry
    When I click the "Delete bank account" button
    When I confirm by clicking the "Delete" button
    Then an error notification containing 'Er is een fout opgetreden' is displayed
    Then the bank account "NL79KOEX0830642005" is displayed
