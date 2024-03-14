# cypress/e2e/Signals/create-signal-on-unexpected-payment.feature

@signalservice @skip
Feature: create signal on unexpected payment amount

  # Signal a user when an unexpected payment amount occurs within a timeframe.

  Background:
    # Given I am logged in as an authorised site user
    # Given 1 or more agreements exists
    # Given an alarm exists
    # Given an alarm is enabled

  Scenario: payment amount too high
    When a bank transaction is booked to an agreement
    Then the bank transaction date is within the alarm timeframe
    Then the bank transaction amount is greater than the sum of the expected amount plus the allowed amount deviation
    Then a "Payment amount too high" signal is created

  Scenario: payment amount too low
    When a bank transaction is booked to an agreement
    Then the bank transaction date is within the alarm timeframe
    Then the bank transaction amount is smaller than the sum of the expected amount minus the allowed amount deviation
    Then a "Payment amount too low" signal is created

  Scenario: expected payment amount
    When a bank transaction is booked to an agreement
    Then the bank transaction date is within the alarm timeframe
    Then the bank transaction amount is smaller than the sum of the expected amount plus the allowed amount deviation or greater than the sum of the expected amount minus the allowed amount deviation
    Then no signal is created
