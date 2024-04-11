# cypress/e2e/Signals/create-signal-on-unexpected-payment.feature

@cleanupSignal
Feature: create signal on unexpected payment amount

  # Signal a user when an unexpected payment amount occurs within a timeframe.

  Background:
    # Given I am logged in as an authorised site user
    # Given 1 or more agreements exists
    # Given an alarm exists
    # Given an alarm is enabled

  Scenario: payment amount too high
    Given an agreement exists for scenario "payment amount too high"
    Given an alarm exists for scenario "payment amount too high"
    Given a CAMT test file is created with a high payment amount
    When a high amount bank transaction is booked to an agreement
    Then the bank transaction date is within the alarm timeframe
    Then the high amount bank transaction amount is greater than the sum of the expected amount plus the allowed amount deviation
    Then a "Payment amount too high" signal is created

  Scenario: payment amount too low
    Given an agreement exists for scenario "payment amount too low"
    Given an alarm exists for scenario "payment amount too low"
    Given a CAMT test file is created with a low payment amount
    When a low amount bank transaction is booked to an agreement
    Then the bank transaction date is within the alarm timeframe
    Then the low amount bank transaction amount is smaller than the sum of the expected amount minus the allowed amount deviation
    Then a "Payment amount too low" signal is created

  Scenario: expected payment amount
    Given an agreement exists for scenario "expected payment amount"
    Given an alarm exists for scenario "expected payment amount"
    Given a CAMT test file is created with an expected payment amount
    When an expected amount bank transaction is booked to an agreement
    Then the bank transaction date is within the alarm timeframe
    Then the bank transaction amount is smaller than the sum of the expected amount plus the allowed amount deviation or greater than the sum of the expected amount minus the allowed amount deviation
    Then no signal is created
