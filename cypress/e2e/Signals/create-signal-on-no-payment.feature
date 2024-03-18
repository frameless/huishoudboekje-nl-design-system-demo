# cypress/e2e/Signals/create-signal-on-no-payment.feature

@signalservice @skip
Feature: create signal on no payment

  # Signal a user when no payment was received within a timeframe.

  Background:
    # Given I am logged in as an authorised site user
    # Given 1 or more agreements exists
    # Given an alarm exists
    # Given an alarm is enabled
    # Given 0 bank transactions with a transaction date within the alarm timeframe are linked to the agreement

  Scenario: no transaction within timeframe
    When the alarm timeframe expires
    Then a "Payment missing" signal is created