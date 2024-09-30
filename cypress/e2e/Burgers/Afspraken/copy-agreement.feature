
Feature: copy an agreement
  
  # Copy an agreement by duplicating an active agreement or by creating a follow-up agreement

  Background:
    # Given I am logged in as an authorised site user
    # Given an agreement exists for citizen Dingus Bingus

  Scenario: copy an active agreement
    When I add search terms to the agreement
    And I copy the agreement
    Then the agreement details and search terms are copied to a new agreement

  Scenario: create a follow-up agreement to an ended agreement
    When I end an agreement
    And I create a follow-up agreement to the ended agreement
    Then the agreement details and search terms are copied to a new agreement
