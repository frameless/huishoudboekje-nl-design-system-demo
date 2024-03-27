# cypress/e2e/Configuration/set-key-value-pair.feature
@skip
Feature: set key value pair in configuration
  
  # Set a key-value pair in configuration

  Background:
    # Given I am logged in as an authorised site user

  Scenario: set bank account for outgoing payments
    Given I view the "Configuration" page
    Given the "derdengeldenrekening_bic" value does not exist
    Given the "derdengeldenrekening_iban" value does not exist
    Given the "derdengeldenrekening_rekeninghouder" value does not exist
    Given I view the "Add key-value pair" form
    When I set the "Sleutel" field to "derdengeldenrekening_bic"
    When I set the "Waarde" field to "ABNANL2A"
    When I click the "Opslaan" button
    Then a notification of success is displayed
    Then the "derdengeldenrekening_bic" key is displayed
    Then the "ABNANL2A" value is displayed

    When I set the "Sleutel" field to "derdengeldenrekening_iban"
    When I set the "Waarde" field to "NL36ABNA5632579034"
    When I click the "Opslaan" button
    Then a notification of success is displayed
    Then the "derdengeldenrekening_iban" key is displayed
    Then the "NL36ABNA5632579034" value is displayed

    When I set the "Sleutel" field to "derdengeldenrekening_rekeninghouder"
    When I set the "Waarde" field to "Gemeente Sloothuizen Huishoudboekje"
    When I click the "Opslaan" button
    Then a notification of success is displayed
    Then the "derdengeldenrekening_rekeninghouder" key is displayed
    Then the "Gemeente Sloothuizen Huishoudboekje" value is displayed

  Scenario: set default alarm days margin
    Given one or more agreements without alarms exist
    Given the "alarm_afwijking_datum" value does not exist

    When I view the "Configuration" page
    Then the "Add key-value pair" form is displayed

    When I set the "Sleutel" field to "alarm_afwijking_datum"
    When I set the "Waarde" field to 16
    When I click the "Opslaan" button
    Then a notification of success is displayed
    Then the "alarm_afwijking_datum" key is displayed
    Then the "16" value is displayed

    When I view an agreement without alarm
    When I click the "Add alarm" button
    Then the "Add alarm" modal is displayed
    Then the "Toegestane afwijking (in dagen)" value is set to 16

  Scenario: set default alarm amount margin
    Given one or more agreements without alarms exist
    Given the "alarm_afwijking_datum" value does not exist

    When I view the "Configuration" page
    Then the "Add key-value pair" form is displayed

    When I set the "Sleutel" field to "alarm_afwijking_bedrag"
    When I set the "Waarde" field to 321
    When I click the "Opslaan" button
    Then a notification of success is displayed
    Then the "alarm_afwijking_bedrag" key is displayed
    Then the "321" value is displayed

    When I view an agreement without alarm
    When I click the "Add alarm" button
    Then the "Add alarm" modal is displayed
    Then the "Toegestane afwijking bedrag (in euro's)" value is set to 321
