# cypress/e2e/Signals/payment-no-amount-margin.feature

@signalservice @cleanupSignal
Feature: create signal on unexpected payment amount, no amount margin

  # Signal a user when an unexpected payment amount occurs within a timeframe and no amount margin was set.

  Background:
    # Given I am logged in as an authorised site user

  Scenario: payment amount too low, no amount margin
    # agreement amount: 10
    Given an agreement exists for scenario "payment amount too low, no amount margin"
    # expected amount: 10, amount margin: 0
    Given an alarm exists for scenario "payment amount too low, no amount margin"
    # CAMT amount: 9,99
    Given a low amount CAMT test file is created with the amount '9.99'
    When a low amount bank transaction is booked to an agreement
    Then the low amount bank transaction date is within the alarm timeframe
    Then the low amount bank transaction amount is smaller than the sum of the expected amount minus the allowed amount deviation
    Then a "Payment amount too low" signal is created

  Scenario: expected payment amount, no amount margin
    # agreement amount: 10
    Given an agreement exists for scenario "expected payment amount, no amount margin"
    # expected amount: 10, amount margin: 0
    Given an alarm exists for scenario "expected payment amount, no amount margin"
    # CAMT amount: 10
    Given a CAMT test file is created with the amount '10.00'
    When an expected amount bank transaction is booked to an agreement
    Then the bank transaction date is within the alarm timeframe
    Then the bank transaction amount is equal to the sum of the expected amount plus the allowed amount deviation
    Then no signal is created

  Scenario: payment amount too high, no amount margin
    # agreement amount: 10
    Given an agreement exists for scenario "payment amount too high, no amount margin"
    # expected amount: 10, amount margin: 0
    Given an alarm exists for scenario "payment amount too high, no amount margin"
    # CAMT amount: 10,01
    Given a high amount CAMT test file is created with the amount '10.01'
    When a high amount bank transaction is booked to an agreement
    Then the high amount bank transaction date is within the alarm timeframe
    Then the high amount bank transaction amount is greater than the sum of the expected amount plus the allowed amount deviation
    Then a "Payment amount too high" signal is created
