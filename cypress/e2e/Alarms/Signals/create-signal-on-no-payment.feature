# cypress/e2e/Signals/create-signal-on-no-payment.feature

@signalservice
Feature: create signal on no payment

  # Signal a user when no payment was received within a timeframe.

  Background:
    # Given I am logged in as an authorised site user
    # Given 0 bank transactions with a transaction date within the alarm timeframe are linked to the agreement

  @cleanupAlarmSignal
  Scenario: no transaction within timeframe
    Given an agreement exists for scenario "no transaction within timeframe"
    Given an alarm exists for scenario "no transaction within timeframe"
    When the alarm timeframe expires
    Then a "Payment missing" signal is created