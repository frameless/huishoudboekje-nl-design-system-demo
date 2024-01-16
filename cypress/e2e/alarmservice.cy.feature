# cypress/e2e/alarmservice.cy.feature
Feature: Alarm Service

Set an alarm on an expected payment and timeframe. Get a notification on missing or unexpected payment.

Background:
    Given I am logged in as a site user
    And 1 or more agreements exists

Scenario: display no alarm set
    When I open the agreements page
    Then the text "Er is geen alarm ingesteld." is displayed
    And a button with label "Toevoegen" is displayed

Scenario: display monthly alarm
    When I open the agreements page
    Then the recurrency is displayed
    And the day of the month is displayed
    And the allowed deviation in days is displayed
    And the next date is displayed
    And the expected amount is displayed
    And the allowed deviation of the expected amount is displayed
    And the current status of an alarm is displayed
    And a button with label "Verwijderen" is displayed

Scenario: set monthly alarm with basic options
    When I open the alarm settings modal
    Then the recurrency is monthly
    And the link "Meer opties" is displayed
    And the start date is today
    And the day of the month is empty
    And the allowed deviation in days is empty
    And the expected amount is equal to the amount of the agreement
    And the allowed deviation in amount is empty
    And a button with label "Annuleren" is displayed
    And a button with label "Opslaan" is displayed
    And a button for closing the modal is displayed

Scenario: save monthly alarm with basic options
    Given I am viewing an agreement
    And I click the 'Add alarm' button
    When the 'Add alarm modal' opens
    Step I fill in the current date for alarm start date
    Step I fill in the alarm day of the month
    Step I fill in the alarm allowed deviation in days
    Step I fill in the expected payment amount
    Step I fill in the alarm allowed deviation in payment amount
    Step I click the 'Submit' button
    Then the modal is closed
    And a notification of succes is displayed
    And the current status of the alarm on the agreements page is displayed

Scenario: no transaction found within timeframe
    Given 1 or more alarms are enabled
    When 0 bank transactions with a transaction date within the alarm timeframe are linked to the agreement
    Then a notification is set

Scenario: transaction found with unexpected payment
    Given 1 or more alarms are enabled
    When 1 or more bank transactions with a transaction date within the alarm timeframe are linked to the agreement
    And the bank transaction amount is greater than the expected amount plus the allowed amount deviation or smaller than the expected amount minus the allowed amount deviation
    Then a notification is set

Scenario: transaction found with expected payment
    Given 1 or more alarms are enabled
    When 1 or more bank transactions with a transaction date within the alarm timeframe are linked to the agreement
    And the bank transaction amount is smaller than the expected amount plus the allowed amount deviation or greater than the expected amount minus the allowed amount deviation
    Then no notification is set

Scenario: display notification
    Given 1 or more active notifications exist
    When I open the notifications page
    Then the notification description is displayed
    And the notification date is displayed
    And the 'Suppress notification' button is displayed
    And the notification status is displayed

Scenario: suppress notification
    Given 1 or more active notifications exist
    When I open the notifications page
    And I enable the active notifications filter
    And I disable the suppressed notifications filter
    And I click the 'Suppress notification' button of a notification
    Then that notification is closed

Scenario: view suppressed notifications
    Given 1 or more suppressed notifications exist
    When I open the notifications page
    And I enable the suppressed notifications filter
    Then all suppressed notifications are displayed
