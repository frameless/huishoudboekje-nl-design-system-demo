# cypress/e2e/Signals/unexpected-payment.feature

@signalservice @cleanupSignal
Feature: create signal on unexpected payment amount

  # Signal a user when an unexpected payment amount occurs within a timeframe and amount range.

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

  Scenario: payment amount too high, no amount margin, before timeframe
    # agreement amount: 10
    # alarm margin: 0
    Given an agreement exists for scenario "payment amount too high, no amount margin, before timeframe"
    # expected amount: 10, amount margin: 0
    Given an alarm exists for scenario "payment amount too high, no amount margin, before timeframe"
    # CAMT amount: 10,01
    Given a high amount CAMT test file is created with the amount '10.01' and transaction date before the alarm timeframe
    When a high amount bank transaction with transaction date before the alarm timeframe is booked to an agreement
    Then the high amount bank transaction amount is greater than the sum of the expected amount plus the allowed amount deviation
    Then no signal is created

  Scenario: payment amount too high, no amount margin, on start of timeframe
    # agreement amount: 10
    # alarm margin: 0
    Given an agreement exists for scenario "payment amount too high, no amount margin, on start of timeframe"
    # expected amount: 10, amount margin: 0
    Given an alarm exists for scenario "payment amount too high, no amount margin, on start of timeframe"
    # CAMT amount: 10,01
    Given a high amount CAMT test file is created with the amount '10.01' and transaction date on start of the alarm timeframe
    When a high amount bank transaction with transaction date on start of the alarm timeframe is booked to an agreement
    Then the high amount bank transaction date is equal to the start of the alarm timeframe
    Then the high amount bank transaction amount is greater than the sum of the expected amount plus the allowed amount deviation
    Then a "Payment amount too high" signal is created

  Scenario: payment amount too high, no amount margin, in timeframe
    # agreement amount: 10
    # alarm margin: 5
    Given an agreement exists for scenario "payment amount too high, no amount margin, in timeframe"
    # expected amount: 10, amount margin: 0
    Given an alarm exists for scenario "payment amount too high, no amount margin, in timeframe"
    # CAMT amount: 10,01
    Given a high amount CAMT test file is created with the amount '10.01' and transaction date in the alarm timeframe
    When a high amount bank transaction with transaction date within the alarm timeframe is booked to an agreement
    Then the high amount bank later transaction date is within the alarm timeframe
    Then the high amount bank transaction amount is greater than the sum of the expected amount plus the allowed amount deviation
    Then a "Payment amount too high" signal is created

  Scenario: payment amount too high, no amount margin, on end of timeframe
    # agreement amount: 10
    # alarm margin: 5
    Given an agreement exists for scenario "payment amount too high, no amount margin, on end of timeframe"
    # expected amount: 10, amount margin: 0
    Given an alarm exists for scenario "payment amount too high, no amount margin, on end of timeframe"
    # CAMT amount: 10,01
    Given a high amount CAMT test file is created with the amount '10.01' and transaction date on end of alarm timeframe
    When a high amount bank transaction with transaction date on end of the alarm timeframe is booked to an agreement
    Then the high amount bank transaction date is on the end date of the alarm timeframe
    Then the high amount bank transaction amount is greater than the sum of the expected amount plus the allowed amount deviation
    Then a "Payment amount too high" signal is created

  Scenario: payment amount too high, no amount margin, after timeframe
    # agreement amount: 10
    # alarm margin: 0
    Given an agreement exists for scenario "payment amount too high, no amount margin, after timeframe"
    # expected amount: 10, amount margin: 0
    Given an alarm exists for scenario "payment amount too high, no amount margin, after timeframe"
    # CAMT amount: 10,01
    Given a high amount CAMT test file is created with the amount '10.01' and transaction date after alarm timeframe
    When a high amount bank transaction with transaction date after the alarm timeframe is booked to an agreement
    Then the high amount bank transaction date is after the alarm timeframe
    Then the high amount bank transaction amount is greater than the sum of the expected amount plus the allowed amount deviation
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