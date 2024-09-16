# cypress/e2e/Signals/filter-signal-type.feature

@signalservice 
Feature: filter signal type

  # Filter on types of signals.

  Background:
    # Given I am logged in as an authorised site user

  Scenario: multiple signals exist
    Given a signal with the type "Missende betaling" exists
    Given a signal with the type "Negatief saldo" exists
    Given a signal with the type "Meerdere transacties" exists
    Given a signal with the type "Onverwacht bedrag" exists
    Then signals with the text 'geen transactie gevonden' are displayed
    Then signals with the text 'afwijking' are displayed
    Then signals with the text 'meerdere transacties' are displayed
    Then signals with the text 'negatief saldo' are displayed

  @afterCleanupRemoveOption
  Scenario: remove option
    When I navigate to the page '/signalen'
    Given all type filters are enabled
    When I click the delete icon for option 'Missende betaling'
    Then signals with the text 'geen transactie gevonden' are not displayed

  Scenario: remove all
    When I navigate to the page '/signalen'
    Given all type filters are enabled
    When I click the delete icon for all options
    Then none of the signals are displayed

  @afterCleanupFilterSignalType
  Scenario: add options one by one
    When I navigate to the page '/signalen'
    And I select the option 'Missende betaling'
    Then signals with the text 'geen transactie gevonden' are displayed

    When I select the option 'Onverwacht bedrag'
    Then signals with the text 'afwijking' are displayed

    When I select the option 'Meerdere transacties'
    Then signals with the text 'meerdere transacties' are displayed

    When I select the option 'Negatief saldo'
    Then signals with the text 'negatief saldo' are displayed
