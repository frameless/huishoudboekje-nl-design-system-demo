# cypress/e2e/Alarms/read-alarm-settings.feature

Feature: read alarm

  # Read the properties of an alarm.

  Background:
    # Given I am logged in as an authorised site user
    # Given 1 or more agreements exists

  @beforecleanupAlarm
  Scenario: no alarm exists
    When I view the "Agreement" page
    Then the text 'Er is geen alarm ingesteld.' is displayed
    Then the button 'Toevoegen' is displayed

  # Scenario: one-time alarm exists
    # TODO
    
  @afterCleanupAlarm
  Scenario: monthly recurring alarm exists
    When I view the "Agreement" page
    Given a monthly recurring alarm exists
    Then the alarm recurrency is displayed
    Then the alarm day of the month is displayed
    Then the alarm allowed deviation in days is displayed
    Then the alarm next date is displayed
    Then the alarm expected amount is displayed
    Then the alarm allowed deviation of the expected amount is displayed
    Then the alarm status is displayed
    Then the "Delete alarm" button is displayed

