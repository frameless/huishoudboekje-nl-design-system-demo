# cypress/e2e/Configuration/set-default-alarm-days-deviation.feature

Feature: set default alarm days deviation

  # Set a default value for the alarm days deviation.

  Background:
    # Given I am logged in as an authorised site user

  @afterCleanupDefaultDateDeviation
  Scenario: save default alarm days deviation
    Given the "Carly Padilla" citizen exists
    Given the "Gemeente Utrecht" organisation exists
    Given the "Gemeente Utrecht" department exists
    Given the "Gemeente Utrecht" department has the "Postbus 16200, 3500CE Utrecht" postal address
    Given the "Gemeente Utrecht" department has the "NL49BNGH0285171712" IBAN
    Given the "Gemeente Utrecht" department has the "Gemeente Utrecht Huishoudboekje" account holder name
    Given I navigate to the page '/configuratie'
    Given the "Uitkeringen" classification exists

    Given the "Add key-value pair form" is displayed
    When I set the field "Sleutel" to 'alarm_afwijking_datum'
    When I set the field "Waarde" to '5'
    When I click the button "Opslaan" in the section with the header "Parameters"
    Then a notification of success is displayed
    Then the text 'alarm_afwijking_datum' is displayed
    Then the text '5' is displayed

    When I open the "Citizen details" page for the "Carly Padilla" citizen
    When I click the button 'Toevoegen'
    When I set the "Partij" option to "Organisatie"
    Then the field 'Organisatie' is displayed
    Then the field 'Afdeling' is displayed
    Then the field 'Postadres' is displayed
    Then the field 'Tegenrekening' is displayed

    When I set the field "Organisatie" to 'Gemeente Utrecht'
    When the field "Afdeling" is set to 'Gemeente Utrecht'
    When I set the field "Postadres" to 'Postbus 16200, 3500CE Utrecht'
    When I set the field "Tegenrekening" to 'NL49 BNGH 0285 1717 12'
    When I set the "Payment direction" option to "Inkomsten"
    Then the field 'Rubriek' is displayed
    Then the field 'Omschrijving' is displayed
    Then the field 'Bedrag' is displayed

    When I set the field "Rubriek" to 'Uitkeringen'
    When I set the field "Omschrijving" to 'Periodieke uitkering'
    When I set the field "Bedrag" to '1234'
    When I set the field "Startdatum" to '29-04-2024'
    When I click the button "Opslaan"
    Then a notification of success is displayed

    When I click the button 'Toevoegen'
    Then the "Create alarm form" is displayed
    Then the "Toegestane afwijking dag" field is set to '5'
