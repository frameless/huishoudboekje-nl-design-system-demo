# cypress/e2e/Configuration/create-settings.feature

Feature: create settings

  # Add required and optional parameters for the proper operation of the application.

  Background:
    # Given I am logged in as an authorised site user

  Scenario: view add key-value pair form
    When I navigate to the page '/configuratie'
    Then the field "Sleutel" is displayed
    Then the field "Sleutel" is marked as required
    Then the field "Sleutel" is empty
    Then the field "Waarde" is displayed
    Then the field "Waarde" is marked as required
    Then the field "Waarde" is empty
    Then the button "Opslaan" is displayed in the section with the header "Parameters"
    Then the text "Verplicht veld" is displayed

  @afterCleanupCreateSettings
  Scenario: save key-value pair
    When I navigate to the page '/configuratie'
    When I set the field "Sleutel" to 'Dit is de sleutel'
    When I set the field "Waarde" to 'Dit is de waarde'
    When I click the button "Opslaan" in the section with the header "Parameters"
    Then an error notification containing 'does not match' is displayed

    When I set the field "Sleutel" to 'Dit_is_de_sleutel'
    When I click the button "Opslaan" in the section with the header "Parameters"
    Then a success notification containing 'Configuratie opgeslagen.' is displayed
    Then the text 'Dit_is_de_sleutel' is displayed
    Then the text "Dit is de waarde" is displayed
    Then the button "Wijzigen" is displayed for the key 'Dit_is_de_sleutel'
    Then the button "Verwijderen" is displayed for the key 'Dit_is_de_sleutel'
