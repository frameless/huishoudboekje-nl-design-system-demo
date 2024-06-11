# cypress/e2e/Configuration/set-bank-account-for-sepa-payment-instruction.feature

Feature: set bank account for sepa payment instruction

  # Set required bank account values for sepa payment instruction export.

  Background:
    # Given I am logged in as an authorised site user

  @beforeCleanupPaymentInstruction @afterCleanupPaymentInstruction
  Scenario: set sepa payment instruction bank account
    When I navigate to the page '/configuratie'
    Given the text 'derdengeldenrekening_bic' is not displayed
    Given the text 'derdengeldenrekening_iban' is not displayed
    Given the text 'derdengeldenrekening_rekeninghouder' is not displayed

    Given the "Dingus Bingus" citizen exists
    When I open the "Citizen details" page for the "Dingus Bingus" citizen
    # Then the text 'HHB000003' is displayed
    Given the "Gemeente Utrecht" organisation exists
    Given the "Gemeente Utrecht" department exists
    Given the "Gemeente Utrecht" department has the "Postbus 16200, 3500CE Utrecht" postal address
    Given the "Gemeente Utrecht" department has the "NL49BNGH0285171712" IBAN
    Given the "Gemeente Utrecht" department has the "Gemeente Utrecht Huishoudboekje" account holder name
    Given I navigate to the page '/configuratie'
    Given the "Privé-opname" exists with the accounting reference "BEivKapProPok"

    When I open the "Citizen details" page for the "Dingus Bingus" citizen
    When I click the button 'Toevoegen'
    When I set the "Partij" option to "Organisatie"
    When I set the field "Organisatie" to 'Gemeente Utrecht'
    When the field "Afdeling" is set to 'Gemeente Utrecht'
    When I set the field "Postadres" to 'Postbus 16200, 3500CE Utrecht'
    When I set the field "Tegenrekening" to 'NL49 BNGH 0285 1717 12'
    When I set the "Payment direction" option to "Uitgaven"
    When I set the field "Rubriek" to 'Privé-opname'
    When I set the field "Omschrijving" to 'Maandelijks leefgeld HHB000003'
    When I set the field "Bedrag" to '1482.11'
    When I set the field "Startdatum" to '01-05-2024'
    When I click the button "Opslaan"
    Then a success notification containing 'De afspraak is opgeslagen.' is displayed
    Then the page is redirected to the agreement page

    When I click the button "Toevoegen" in the section with the header "Betaalinstructie"
    Then the page is redirected to the payment instruction page for this agreement
    When I set the radio "Periodiek" to "Herhalend"
    When I set the field "Startdatum" to '01-05-2024'
    When I set the select option "Herhaling" to "Maandelijks"
    When I set the field "Dag van de maand" to "1"
    When I click the button "Opslaan"
    Then a success notification containing 'De betaalinstructie is ingesteld.' is displayed
    Then the page is redirected to the agreement page
    Then the text 'Elke maand op de 1e' is displayed
    Then the text 'Vanaf 01-05-2024 t/m ∞' is displayed

    When I navigate to the page '/bankzaken/betaalinstructies'
    When I set the field "Periode" to "01-05-2024 - 01-05-2024"
    When I click the button 'Exporteren'
    Then an error notification containing 'object is not subscriptable' is displayed

    When I navigate to the page '/configuratie'
    When I set the field "Sleutel" to "derdengeldenrekening_bic"
    When I set the field "Waarde" to "ABNANL2A"
    When I click the button "Opslaan" in the section with the header "Parameters"
    Then a success notification containing 'Configuratie opgeslagen.' is displayed
    Then the text 'derdengeldenrekening_bic' is displayed
    Then the value "ABNANL2A" for the key "derdengeldenrekening_bic" is displayed

    When I set the field "Sleutel" to "derdengeldenrekening_iban"
    When I set the field "Waarde" to "NL36ABNA5632579034"
    When I click the button "Opslaan" in the section with the header "Parameters"
    Then a success notification containing 'Configuratie opgeslagen.' is displayed
    Then the text 'derdengeldenrekening_iban' is displayed
    Then the value "NL36ABNA5632579034" for the key "derdengeldenrekening_iban" is displayed

    When I set the field "Sleutel" to "derdengeldenrekening_rekeninghouder"
    When I set the field "Waarde" to "Gemeente Sloothuizen Huishoudboekje"
    When I click the button "Opslaan" in the section with the header "Parameters"
    Then a success notification containing 'Configuratie opgeslagen.' is displayed
    Then the text 'derdengeldenrekening_rekeninghouder' is displayed
    Then the value "Gemeente Sloothuizen Huishoudboekje" for the key "derdengeldenrekening_rekeninghouder" is displayed

    When I navigate to the page '/bankzaken/betaalinstructies'
    When I set the field "Periode" to "01-05-2024 - 01-05-2024"
    When I click the button 'Exporteren'
    Then a success notification containing 'Exportbestand aangemaakt.' is displayed

# checken of deze drie parameters toegepast zijn in specifieke attributen in XML
    Then I click the button "Downloaden" for the most recent entry
    Then the exported file contains 'ABNANL2A'
    Then the exported file contains 'NL36ABNA5632579034'
    Then the exported file contains 'Gemeente Sloothuizen Huishoudboekje'
