# cypress/e2e/Alarms/create-alarm.feature

Feature: create alarm
  
  # Set an alarm on an expected payment and timeframe. Get a notification on missing or unexpected payment.

  Background:
    # Given I am logged in as an authorised site user
    # Given 1 or more agreements exists

  @skip @afterCleanupAlarm
  Scenario: create weekly alarm with basic options
    Given I view a citizen's agreement
    When I click the button 'Toevoegen' in the alarm section
    And I submit valid information in the modal's fields
    Then an alarm is created

  @beforeCreateAgreement @afterCleanupAlarm
  Scenario: create monthly alarm with basic options
    Given I view a citizen's agreement
    When I click the button 'Toevoegen' in the alarm section
    And I submit valid information in the modal's fields
    Then the created alarm is displayed
