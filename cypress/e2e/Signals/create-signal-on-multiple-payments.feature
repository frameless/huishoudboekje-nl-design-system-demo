# cypress/e2e/Signals/create-signal-on-multiple-payments.feature

@signalservice @skip
Feature: create signal on multiple payments

  # Signal a user when multiple payments happened within a timeframe.

  Background:
    # Given I am logged in as an authorised site user
    # Given 1 or more agreements exists
    # Given an alarm exists
    # Given an alarm is enabled
    # Given 2 or more bank transactions with a transaction date within the alarm timeframe are linked to the agreement

  Scenario: multiple payments within timeframe
    When the alarm timeframe expires
    Then a "Multiple payments" signal is created
