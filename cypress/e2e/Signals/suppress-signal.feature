# cypress/e2e/Signals/suppress-signal.feature

@signalservice @skip
Feature: suppress signal

  # Suppress a signal, but keep the alarm enabled.

  Scenario: suppress an active signal
    Given 1 or more active signals exist
    When I view the "Signals" page
    Then I enable the active signals filter
    Then I disable the suppressed signals filter
    Then I click the "Suppress signal" button of a signal
    Then that signal is closed

