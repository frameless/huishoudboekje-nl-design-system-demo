# cypress/e2e/Signals/payment-with-amount-margin.feature

@signalservice @cleanupSignal
Feature: create signal on unexpected payment amount, with amount margin

  # Signal a user when an unexpected payment amount occurs within a timeframe and any amount margin was set.

  Background:
    # Given I am logged in as an authorised site user

  Scenario: payment amount too low, outside amount margin
    # agreement amount: 10
    Given an agreement exists for feature "create signal on unexpected payment amount, with amount margin"
    # expected amount: 10, amount margin: 0,99
    Given an alarm exists for feature "create signal on unexpected payment amount, with amount margin"
    # CAMT amount: 9
    Given a CAMT test file is created for scenario "payment amount too low, outside amount margin" with the amount '9.00'
    When the low amount outside amount margin bank transaction is booked to an agreement
    Then the low amount outside amount margin bank transaction date is within the alarm timeframe
    Then the low amount outside amount margin bank transaction amount is smaller than the sum of the expected amount minus the allowed amount deviation
    Then a "Payment amount too low, outside amount margin" signal is created

  Scenario: payment amount too low, on amount margin
    # agreement amount: 10
    Given an agreement exists for feature "create signal on unexpected payment amount, with amount margin"
    # expected amount: 10, amount margin: 0,99
    Given an alarm exists for feature "create signal on unexpected payment amount, with amount margin"
    # CAMT amount: 9,01
    Given a CAMT test file is created for scenario "payment amount too low, on amount margin" with the amount '9.01'
    When the low amount on amount margin bank transaction is booked to an agreement
    Then the low amount on amount margin bank transaction date is within the alarm timeframe
    Then the low amount on amount margin bank transaction amount is equal to or greater than the sum of the expected amount minus the allowed amount deviation or equal to or smaller than the sum of the expected amount plus the allowed amount deviation
    Then no signal is created

  Scenario: payment amount too low, within amount margin
    # agreement amount: 10
    Given an agreement exists for feature "create signal on unexpected payment amount, with amount margin"
    # expected amount: 10, amount margin: 0,99
    Given an alarm exists for feature "create signal on unexpected payment amount, with amount margin"
    # CAMT amount: 9,02
    Given a CAMT test file is created for scenario "payment amount too low, within amount margin" with the amount '9.02'
    When the low amount within amount margin bank transaction is booked to an agreement
    Then the low amount within amount margin bank transaction date is within the alarm timeframe
    Then the low amount within amount margin bank transaction amount is equal to or greater than the sum of the expected amount minus the allowed amount deviation or equal to or smaller than the sum of the expected amount plus the allowed amount deviation
    Then no signal is created

  Scenario: expected payment amount, on amount margin
    # agreement amount: 10
    Given an agreement exists for feature "create signal on unexpected payment amount, with amount margin"
    # expected amount: 10, amount margin: 0,99
    Given an alarm exists for feature "create signal on unexpected payment amount, with amount margin"
    # CAMT amount: 10
    Given a CAMT test file is created for scenario "expected payment amount, on amount margin" with the amount '10.00'
    When the expected amount on amount margin bank transaction is booked to an agreement
    Then the expected amount on amount margin bank transaction date is within the alarm timeframe
    Then the expected amount on amount margin bank transaction amount is equal to the sum of the expected amount
    Then no signal is created

  Scenario: payment amount too high, within amount margin
    # agreement amount: 10
    Given an agreement exists for feature "create signal on unexpected payment amount, with amount margin"
    # expected amount: 10, amount margin: 0,99
    Given an alarm exists for feature "create signal on unexpected payment amount, with amount margin"
    # CAMT amount: 10,98
    Given a CAMT test file is created for scenario "payment amount too high, within amount margin" with the amount '10.98'
    When the high amount within amount margin bank transaction is booked to an agreement
    Then the high amount within amount margin bank transaction date is within the alarm timeframe
    Then the high amount within amount margin bank transaction amount is equal to or greater than the sum of the expected amount minus the allowed amount deviation or equal to or smaller than the sum of the expected amount plus the allowed amount deviation
    Then no signal is created

  Scenario: payment amount too high, on amount margin
    # agreement amount: 10
    Given an agreement exists for feature "create signal on unexpected payment amount, with amount margin"
    # expected amount: 10, amount margin: 0,99
    Given an alarm exists for feature "create signal on unexpected payment amount, with amount margin"
    # CAMT amount: 10,99
    Given a CAMT test file is created for scenario "payment amount too high, on amount margin" with the amount '10.99'
    When the high amount on amount margin bank transaction is booked to an agreement
    Then the high amount on amount margin bank transaction date is within the alarm timeframe
    Then the high amount on amount margin bank transaction amount is equal to or greater than the sum of the expected amount minus the allowed amount deviation or equal to or smaller than the sum of the expected amount plus the allowed amount deviation
    Then no signal is created

  Scenario: payment amount too high, outside amount margin
    # agreement amount: 10
    Given an agreement exists for feature "create signal on unexpected payment amount, with amount margin"
    # expected amount: 10, amount margin: 0,99
    Given an alarm exists for feature "create signal on unexpected payment amount, with amount margin"
    # CAMT amount: 11
    Given a CAMT test file is created for scenario "payment amount too high, outside amount margin" with the amount '11.00'
    When the high amount outside amount margin bank transaction is booked to an agreement
    Then the high amount outside amount margin bank transaction date is within the alarm timeframe
    Then the high amount outside amount margin bank transaction amount is greater than the sum of the expected amount plus the allowed amount deviation
    Then a "Payment amount too high, outside amount margin" signal is created

