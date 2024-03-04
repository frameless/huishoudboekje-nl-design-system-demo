# cypress/e2e/Alarms/create-alarm.feature

@alarmservice
Feature: create alarm
  
  # Set an alarm on an expected payment and timeframe. Get a notification on missing or unexpected payment.

  Background:
    # Given I am logged in as an authorised site user
    # Given 1 or more agreements exists

  Scenario: view create alarm form with default options
    When I view the "Add alarm" modal
    Then the "Create alarm form" is displayed
    Then the recurrency is monthly
    Then the link "Meer opties" is displayed
    Then the start date is today
    Then the day of the month is empty
    Then the allowed deviation in days is empty
    Then the expected amount is equal to the amount of the agreement
    Then the allowed deviation in amount is empty
    Then the "Cancel" button is displayed
    Then the "Submit form" button is displayed
    Then the "Close modal" button is displayed

  Scenario: save monthly alarm with basic options
    When I view the "Agreement" page
    When I click the "Add alarm" button
    Then a modal opens
    Then the "Create alarm form" is displayed
    Then I fill in the current date for alarm start date
    Then I fill in the alarm day of the month
    Then I fill in the alarm allowed deviation in days
    Then I fill in the expected payment amount
    Then I fill in the alarm allowed deviation in payment amount
    Then I click the "Submit form" button
    Then the modal is closed
    Then a notification of success is displayed
    Then the current status of the alarm on the agreements page is displayed
