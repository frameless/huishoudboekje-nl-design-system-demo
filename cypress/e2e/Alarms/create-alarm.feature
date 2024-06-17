# cypress/e2e/Alarms/create-alarm.feature

Feature: create alarm
  
  # Set an alarm on an expected payment and timeframe. Get a notification on missing or unexpected payment.

  Background:
    # Given I am logged in as an authorised site user
    # Given 1 or more agreements exists

  @beforeCreateAgreement
  Scenario: view create alarm form with default options
    When I view the "Add alarm" modal
    Then the "Create alarm form" is displayed
    Then the recurrency is monthly
    Then the button 'Meer opties' is displayed
    Then the label 'Startdatum (kan niet in het verleden zijn)' is displayed
    Then the label 'Startdatum (kan niet in het verleden zijn)' is marked as required
    Then the start date field is displayed
    Then the start date field value is today
    Then the label 'Dag in de maand' is displayed
    Then the label 'Dag in de maand' is marked as required
    Then the day of the month field is displayed
    Then the day of the month field value is empty
    Then the label 'Toegestane afwijking (in dagen)' is displayed
    Then the label 'Toegestane afwijking (in dagen)' is marked as required
    Then the allowed time deviation field is displayed
    Then the allowed time deviation field is empty
    Then the label 'Bedrag verwachte betaling' is displayed
    Then the label 'Bedrag verwachte betaling' is marked as required
    Then the expected amount field is displayed
    Then the expected amount field value is equal to the amount of the agreement
    Then the label 'Toegestane afwijking bedrag' is displayed
    Then the label 'Toegestane afwijking bedrag' is marked as required
    Then the allowed amount deviation field is displayed
    Then the allowed amount deviation field is empty
    Then the button 'Annuleren' is displayed
    Then the button 'Opslaan' is displayed
    Then the text 'Verplicht veld' is displayed
    Then the "Close modal" button is displayed

  @skip @afterCleanupAlarm
  Scenario: save weekly alarm with basic options
    When I view the "Agreement" page
    When I click the button 'Toevoegen'
    Then the "Create alarm form" is displayed
    When I click the "Meer opties" link
    Then the recurrency is recurring
    Then the frequency is monthly
    When I set the frequency to weekly
    When I fill in the alarm day of the week
    When I fill in the current date for alarm start date
    When I fill in the alarm allowed deviation in days
    When I fill in the expected payment amount
    When I fill in the alarm allowed deviation in payment amount
    When I click the "Submit form" button
    Then the "Create alarm form" modal is closed
    Then a success notification containing 'Het alarm is opgeslagen' is displayed
    Then the current status of the alarm on the agreements page is displayed

  @afterCleanupAlarm
  Scenario: save monthly alarm with basic options
    When I view the "Agreement" page
    When I click the button 'Toevoegen'
    Then the "Create alarm form" is displayed
    Then I fill in the current date for alarm start date
    Then I fill '1' into the alarm day of the month field
    Then I fill '1' into the alarm allowed deviation in days field
    Then I fill in the expected payment amount
    Then I fill '1' into the alarm allowed deviation in payment amount field
    Then I click the "Submit form" button
    Then the "Create alarm form" modal is closed
    Then a success notification containing 'Het alarm is opgeslagen' is displayed
    Then the current status of the alarm on the agreements page is displayed
