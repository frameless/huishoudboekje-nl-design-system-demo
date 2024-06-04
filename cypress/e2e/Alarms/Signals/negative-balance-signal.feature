# cypress/e2e/Signals/negative-balance-signal.feature

Feature: create signal on negative balance

  # Signal a negative balance for a citizen. Add priority to a repeating signal.

  Background:
    # Given I am logged in as an authorised site user
    # Given a citizen exists

    @beforeTruncateSignals
    Scenario: negative citizen balance
    # citizen with balance 0 should not trigger signal
        When I open the citizen overview page for "Mcpherson Patterson"
        Given the citizen's balance is '0,00'
        Given the negative account balance alarm toggle is displayed
        Then the negative account balance alarm toggle is set to enabled
        Given an agreement exists for scenario "negative citizen balance"
    # add transaction with amount 0
        Given I select a CAMT test file with zero payment amount
        When the zero amount bank transaction is booked to the agreement "Loon"
    # no signal
        When I navigate to the page '/signalen'
        Then no signal is created
    # citizen with positive balance should not trigger signal
    # add transaction with amount 10
        Given a positive CAMT test file is created with the amount '10'
        When a positive bank transaction with amount '10,00' is booked to an agreement
    # no signal
        Then no signal is created
    # citizen with negative balance should trigger signal
    # add transaction with amount -10,01 for a balance of -0.01
        Given I select a CAMT test file with negative payment amount '10.01'
        When the negative amount bank transaction with amount '10,01' is booked to the correct agreement
    # signal
        When I navigate to the page '/signalen'
        Then the text 'Er is een negatief saldo geconstateerd bij Mcpherson Patterson.' is displayed
        Then the signal has a timestamp

    Scenario: repeating negative citizen balance, active signal
    # add transaction with amount 0,01 for a balance of 0.00
        Given a positive CAMT test file is created with the amount '0.01'
        When a positive bank transaction with amount '0,01' is booked to an agreement
    # no changed signal
        When I navigate to the page '/signalen'
        Then the text 'Er is een negatief saldo geconstateerd bij Mcpherson Patterson.' is displayed
        Then no new signal is created
    # add transaction with amount -0,01 for a balance of 0.01
        Given I select a CAMT test file with negative payment amount '0.01'
        Then I wait one minute
        When the negative amount bank transaction with amount '0,01' is booked to the correct agreement
    # signal, changed date
        When I navigate to the page '/signalen'
        Then the text 'Er is een negatief saldo geconstateerd bij Mcpherson Patterson.' is displayed
        Then the signal's timestamp has changed

    Scenario: deactivate signal negative balance
        Given I navigate to the page '/signalen'
    # deactivate signal
        When I deactive the top signal
    # no signal visible
        Then no signal is visible
    # apply filter
        When I click the "Uitgeschakelde signalen" filter
    # deactivated signal visible
        Then the text 'Er is een negatief saldo geconstateerd bij Mcpherson Patterson.' is displayed

    @cleanupSixStatementsAgreement
    Scenario: repeating negative citizen balance, deactivated signal
    # reset filter
    # add transaction with amount -0,01
        Given I select a CAMT test file with negative payment amount '0.01'
        Then I wait one minute
        When the negative amount bank transaction with amount '0,01' is booked to the correct agreement
    # signal, changed date
        When I navigate to the page '/signalen'
        Then the activated signal is displayed with a new timestamp
    # deactivated signal is not displayed
        When I click the "Ingeschakelde signalen" filter
        When I click the "Uitgeschakelde signalen" filter
        Then no signal is visible
