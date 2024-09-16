# cypress/e2e/Configuration/manage-classifications.feature

Feature: manage classifications

  # Manage classifications for incoming and outgoing payments to agreements. Classifications are used to group when reporting on data.

  Background:
    # Given I am logged in as an authorised site user

  Scenario: view add classification form
    Given I navigate to the page '/configuratie'
    Then the "Add classification form" is displayed
    Then the field "Naam" is displayed
    Then the field "Naam" is marked as required
    Then the field "Naam" is empty
    Then the field "Grootboekrekening" is displayed
    Then the field "Grootboekrekening" is marked as required
    Then the field "Grootboekrekening" is empty
    Then the button "Opslaan" is displayed in the section with the header "Rubrieken"
    Then the text 'Verplicht veld' is displayed

  Scenario: save classification with incoming payment direction
    Given the 'Dingus Bingus' citizen exists
    Given I navigate to the page '/configuratie'
    Given the "Add classification form" is displayed
    When I set the "Naam" field to 'Huuropbrengsten'
    When I set the "Grootboekrekening" field to "Huuropbrengsten WRevHuoHuo"
    When I click the "Opslaan" button in the section with the header "Rubrieken"
    Then a success notification containing 'toegevoegd' is displayed
    Then the "Huuropbrengsten" classification is displayed
    When I open the citizen overview page for "Dingus Bingus"
    When I click the button 'Toevoegen'
    When I set the "Payment direction" option to "Inkomsten"
    Then the "Rubriek" option is displayed
    When I click the "Rubriek" option
    Then the "Huuropbrengsten" classification is displayed
    When I set the "Payment direction" option to "Uitgaven"
    When I click the "Rubriek" option
    Then the "Huuropbrengsten" classification is not displayed

  @afterCleanupManageClassifications
  Scenario: save classification with outgoing payment direction
    Given the "Dingus Bingus" citizen exists
    Given I navigate to the page '/configuratie'
    When I set the "Naam" field to 'Elektrakosten'
    When I set the "Grootboekrekening" field to "Elektrakosten WKprAklEkn"
    When I click the "Opslaan" button in the section with the header "Rubrieken"
    Then a success notification containing 'toegevoegd' is displayed
    Then the "Elektrakosten" classification is displayed
    When I open the citizen overview page for "Dingus Bingus"
    When I click the button 'Toevoegen'
    When I set the "Payment direction" option to "Inkomsten"
    Then the "Rubriek" option is displayed
    When I click the "Rubriek" option
    Then the "Elektrakosten" classification is not displayed
    When I set the "Payment direction" option to "Uitgaven"
    When I click the "Rubriek" option
    Then the "Elektrakosten" classification is displayed
