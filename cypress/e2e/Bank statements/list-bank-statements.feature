# cypress/e2e/Alarms/list-bank-statements.feature
@skip
Feature: list bank statements

  # List all bank statements.

  Background:
  # Given I am logged in as an authorised site user

  # Scenario: view create bank account form

  Scenario: no bank statements exist
    Given 0 bank statements exist
    When I view the "Bank statements" page
    Then the "Er zijn geen bankafschriften gevonden." text is displayed
    Then the "Add bank statement" button is displayed

  Scenario: bank statements exist
    Given 1 or more bank statements exist
    When I view the "Bank statement" page
    Then the bank statement filename is displayed
    Then the bank statement upload timestamp is displayed
    Then the "Delete bank statement" button is displayed
    Then the "Add bank statement" button is displayed
