# cypress/e2e/Signals/create-signal-on-multiple-payments.feature

@signalservice
Feature: create signal on multiple payments

  # Signal a user when multiple payments happened within a timeframe.

  Background:
    # Given I am logged in as an authorised site user
    # Given an alarm is enabled
    # Given 2 or more bank transactions with a transaction date within the alarm timeframe are linked to the agreement

  @cleanupTwoSignals
  Scenario: multiple payments within timeframe
    Given an agreement exists for scenario "multiple payments within timeframe"
    Given an alarm exists for scenario "multiple payments within timeframe"
    Given two CAMT test files are created with the same transaction date
    When both bank transactions are reconciliated on the same agreement
    Then a "Multiple payments" signal is created
