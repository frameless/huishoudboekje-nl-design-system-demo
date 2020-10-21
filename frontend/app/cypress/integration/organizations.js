import "cypress-graphql-mock";
import Routes from "../../src/config/routes";

const sampleOrganizations = require("../fixtures/organizations.json");

beforeEach(() => {
	cy.task("getSchema").then(schema => {
		cy.server();
		cy.route2("GET", "/api/me", {
			body: {
				ok: true,
			}
		}).as("DexStub");
		cy.mockGraphql({
			schema,
		});
		cy.mockGraphqlOps({
			delay: 1000,
			operations: {
				getAllOrganisaties: {
					organisaties: sampleOrganizations,
				},
				getOneOrganisatie: {
					organisatie: sampleOrganizations[0],
				},
				createOrganisatie: (props) => ({
					ok: true,
					organisatie: props
				}),
				updateOrganisatie: (props) => ({
					ok: true,
					organisatie: props
				}),
				deleteOrganisatie: {
					ok: true,
				}
			}
		});
	});
});

describe("Organizations CRUD", () => {
	it("Lists organizations", () => {
		// Go to organizations list page
		cy.visit(Routes.Organizations);

		sampleOrganizations.forEach(o => {
			cy.get(".organizationCard").should("contain", o.weergaveNaam);
			cy.get(".organizationCard").should("contain", o.kvkDetails.plaatsnaam);
		});
	});

	it("Creates an organization", () => {
		// Go to organizations list page
		cy.visit(Routes.Organizations);

		// Click the add button
		cy.get("button").should("contain", "Toevoegen");
		cy.get("button").contains("Toevoegen").click();

		// Fill the form
		cy.get("input#kvkNumber").type(sampleOrganizations[0].kvkNummer);
		cy.get("input#displayName").type(sampleOrganizations[0].weergaveNaam);
		cy.get("input#companyName").type(sampleOrganizations[0].weergaveNaam);
		cy.get("input#city").type(sampleOrganizations[0].kvkDetails.plaatsnaam);
		cy.get("input#zipcode").type(sampleOrganizations[0].kvkDetails.postcode);
		cy.get("input#street").type(sampleOrganizations[0].kvkDetails.straatnaam);
		cy.get("input#houseNumber").type(sampleOrganizations[0].kvkDetails.huisnummer);

		// Press submit
		cy.get("button").contains("Opslaan").click();
		cy.get(".Toaster").should("contain", "succesvol");
	});

	it("Updates an organization", () => {
		// Go to organizations list page
		cy.visit(Routes.Organization(1));

		// Check if we're on the right page
		cy.get("h2").should("contain", sampleOrganizations[0].weergaveNaam);
		cy.get("button").should("contain", "Opslaan");

		// Update data by filling in the form with different company details
		cy.get("input#kvkNumber").clear().type(sampleOrganizations[1].kvkNummer);
		cy.get("input#displayName").clear().type(sampleOrganizations[1].weergaveNaam);
		cy.get("input#companyName").clear().type(sampleOrganizations[1].weergaveNaam);
		cy.get("input#city").clear().type(sampleOrganizations[1].kvkDetails.plaatsnaam);
		cy.get("input#zipcode").clear().type(sampleOrganizations[1].kvkDetails.postcode);
		cy.get("input#street").clear().type(sampleOrganizations[1].kvkDetails.straatnaam);
		cy.get("input#houseNumber").clear().type(sampleOrganizations[1].kvkDetails.huisnummer);

		// Press submit
		cy.get("button").contains("Opslaan").click();
		cy.get(".Toaster").should("contain", "succesvol");
	});

	it("Deletes an organization", () => {
		// Go to organizations list page
		cy.visit(Routes.Organization(1));

		// Check if we're on the right page
		cy.get("h2").should("contain", sampleOrganizations[0].weergaveNaam);
		cy.get("button#actionsMenuButton").click();
		cy.get("button").should("contain", "Verwijderen");

		// Press delete button
		cy.get("button").contains("Verwijderen").click();

		// Press delete button in dialog
		cy.get("button").contains("Verwijderen").click();

		cy.get(".Toaster").should("contain", "verwijderd");
		cy.get("p").should("contain", "verwijderd");
	});
});