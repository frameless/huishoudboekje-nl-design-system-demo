import "cypress-graphql-mock";
import Routes from "../../src/config/routes";

const sampleBurgers = require("../fixtures/burgers.json");


xdescribe("Burgers CRUD", () => {
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
					getAllGebruikers: {
						gebruikers: sampleBurgers,
					},
					getOneGebruiker: {
						gebruiker: sampleBurgers[0],
					},
					createGebruiker: (props) => ({
						ok: true,
						gebruiker: props
					}),
					updateGebruiker: (props) => ({
						ok: true,
						gebruiker: props
					}),
					deleteGebruiker: {
						ok: true,
					}
				}
			});
		});
	});

	it("Lists burgers", () => {
		// Go to burgers list page
		cy.visit(Routes.Citizens);

		sampleBurgers.forEach(b => {
			cy.get(".burgerCard").should("contain", b.voornamen);
			cy.get(".burgerCard").should("contain", b.achternaam);
		});
	});

	it("Creates a burger", () => {
		// Go to burgers list page
		cy.visit(Routes.CitizenNew);

		// Fill the form
		cy.get("input#initials").type(sampleBurgers[0].voorletters);
		cy.get("input#firstName").type(sampleBurgers[0].voornamen);
		cy.get("input#lastName").type(sampleBurgers[0].achternaam);
		cy.get("input#dateOfBirth-day").type(new Date(sampleBurgers[0].geboortedatum).getDate().toString());
		cy.get("select#dateOfBirth-month").select(new Date(sampleBurgers[0].geboortedatum).getMonth().toString());
		cy.get("input#dateOfBirth-year").type(new Date(sampleBurgers[0].geboortedatum).getFullYear().toString());
		cy.get("input#street").type(sampleBurgers[0].straatnaam);
		cy.get("input#houseNumber").type(sampleBurgers[0].huisnummer);
		cy.get("input#zipcode").type(sampleBurgers[0].postcode);
		cy.get("input#city").type(sampleBurgers[0].plaatsnaam);
		cy.get("input#phoneNumber").type(sampleBurgers[0].telefoonnummer);
		cy.get("input#mail").type(sampleBurgers[0].email);

		// Press submit
		cy.get("button").contains("Opslaan").click();
		cy.get(".Toaster").should("contain", "succesvol");
	});

	it("Updates a burger", () => {
		// Go to burger detail page
		cy.visit(Routes.Citizen(1));

		// Check if we're on the right page
		cy.get("h2").should("contain", sampleBurgers[0].voornamen);
		cy.get("h2").should("contain", sampleBurgers[0].achternaam);

		// Fill the form
		cy.get("input#initials").clear().type(sampleBurgers[1].voorletters);
		cy.get("input#firstName").clear().type(sampleBurgers[1].voornamen);
		cy.get("input#lastName").clear().type(sampleBurgers[1].achternaam);
		cy.get("input#dateOfBirth-day").clear().type(new Date(sampleBurgers[1].geboortedatum).getDate().toString());
		cy.get("select#dateOfBirth-month").select(new Date(sampleBurgers[1].geboortedatum).getMonth().toString());
		cy.get("input#dateOfBirth-year").clear().type(new Date(sampleBurgers[1].geboortedatum).getFullYear().toString());
		cy.get("input#street").clear().type(sampleBurgers[1].straatnaam);
		cy.get("input#houseNumber").clear().type(sampleBurgers[1].huisnummer);
		cy.get("input#zipcode").clear().type(sampleBurgers[1].postcode);
		cy.get("input#city").clear().type(sampleBurgers[1].plaatsnaam);
		cy.get("input#phoneNumber").clear().type(sampleBurgers[1].telefoonnummer);
		cy.get("input#mail").clear().type(sampleBurgers[1].email);

		// Press submit
		cy.get("button").contains("Opslaan").click();
		cy.get(".Toaster").should("contain", "succesvol");
	});

	it("Deletes a burger", () => {
		// Go to burgers list page
		cy.visit(Routes.Citizen(1));

		// Check if we're on the right page
		cy.get("h2").should("contain", sampleBurgers[0].voornamen);
		cy.get("h2").should("contain", sampleBurgers[0].achternaam);
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