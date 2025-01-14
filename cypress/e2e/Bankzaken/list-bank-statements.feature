# cypress/e2e/Alarms/list-bank-statements.feature
Feature: list bank statements

  # List all bank statements.

  Background:
    # Given I am logged in as an authorised site user

  Scenario: no bank statements exist
    Given 0 bank statements exist
    When I navigate to the page '/bankzaken/bankafschriften'
    Then the "Er zijn geen bankafschriften gevonden" text is displayed
    Then the "Add bank statement" button is displayed

  @cleanupStatements
  Scenario: bank statements exist
    Given 1 or more bank statements exist
    When I navigate to the page '/bankzaken/bankafschriften'
    Then the bank statement filenames are displayed
    Then the bank statement upload timestamp is displayed
    Then the "Delete bank statement" button is displayed
    Then the "Add bank statement" button is displayed

