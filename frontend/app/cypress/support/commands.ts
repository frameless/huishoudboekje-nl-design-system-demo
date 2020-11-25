/// <reference types="cypress" />
Cypress.Commands.add("login", () => {
	cy.intercept("GET", "/api/me", {
		body: {
			email: "koen.brouwer@vng.nl",
			groups: {}
		}
	}).as("DexStub");
});

declare namespace Cypress {
	interface Chainable {
		login(): Chainable<Element>
	}
}