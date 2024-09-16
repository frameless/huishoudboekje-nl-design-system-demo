# cypress/e2e/Bank statements/Payment Instructions/display-payment-instructions-in-file.feature

Feature: display payment instructions in file

  # Display details of payment instructions that were included in a payment instruction file.

  @createPaymentInstruction
  Scenario: read payment instructions
    When I navigate to the page "/bankzaken/betaalinstructies"
    And I view the first payment instruction export entry
    Then I am redirected to a payment instruction detail page
    And the included payment instructions are displayed
