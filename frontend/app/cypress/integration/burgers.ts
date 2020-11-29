import "cypress-graphql-mock";
import Routes from "../../src/config/routes";
import sampleBurgers from "../fixtures/burgers.json";
import "../support/commands";

beforeEach(() => {
	cy.task("getSchema").then((schema: string) => {
		cy.login();
		cy.mockGraphql({
			schema,
			mocks: {
				Date,
				Bedrag: String
			}
		});
		cy.mockGraphqlOps({
			operations: {
				getAllGebruikers: {
					gebruikers: sampleBurgers,
				},
				getOneGebruiker: ({id}) => ({
					gebruiker: sampleBurgers.find(b => b.id === parseInt(id))
				}),
				createGebruiker: (props) => ({
					createGebruiker: {
						gebruiker: {
							...props,
							id: sampleBurgers[sampleBurgers.length - 1].id
						}
					}
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
})

describe("Burgers CRUD", () => {

	xit("Shows a list of burgers", () => {
		// Go to burgers list page
		cy.visit(Routes.Burgers);

		sampleBurgers.forEach(b => {
			cy.get("div").should("contain", b.voornamen);
			cy.get("div").should("contain", b.achternaam);
		});
	});

	xit("Shows a a single burger", () => {
		// Go to burgers list page
		const b = sampleBurgers[0];
		cy.visit(Routes.Burger(b.id));

		cy.get("div").should("contain", b.voornamen);
		cy.get("div").should("contain", b.achternaam);
	});

	xit("Creates a burger", () => {
		// Go to burgers list page
		cy.visit(Routes.CreateBurger);

		// Todo: can't explain why, but for some reason it fails on a second /api/me call. (24-11-2020)
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(1000);

		// Fill the form
		const b = sampleBurgers[0];

		cy.get("input#initials").type(b.voorletters);
		cy.get("input#firstName").type(b.voornamen);
		cy.get("input#lastName").type(b.achternaam);
		cy.get("input#dateOfBirth-day").type(new Date(b.geboortedatum).getDate().toString());
		cy.get("select#dateOfBirth-month").select(new Date(b.geboortedatum).getMonth().toString());
		cy.get("input#dateOfBirth-year").type(new Date(b.geboortedatum).getFullYear().toString());
		cy.get("input#street").type(b.straatnaam);
		cy.get("input#houseNumber").type(b.huisnummer);
		cy.get("input#zipcode").type(b.postcode);
		cy.get("input#city").type(b.plaatsnaam);
		cy.get("input#phoneNumber").type(b.telefoonnummer);
		cy.get("input#mail").type(b.email);

		// Press submit
		cy.get("button").contains("Opslaan").click();
		cy.get(".chakra-toast").should("contain", "succesvol");
	});

	xit("Updates a burger", () => {
		const b1 = sampleBurgers[0];
		const b2 = sampleBurgers[1];

		// Go to burger detail page
		cy.visit(Routes.EditBurger(b1.id));

		// Todo: can't explain why, but for some reason it fails on a second /api/me call. (24-11-2020)
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(2000);

		// Check if we're on the right page
		cy.get("h2").should("contain", b1.voornamen);
		cy.get("h2").should("contain", b1.achternaam);

		// Fill the form
		cy.get("input#initials").clear().type(b2.voorletters);
		cy.get("input#firstName").clear().type(b2.voornamen);
		cy.get("input#lastName").clear().type(b2.achternaam);
		cy.get("input#dateOfBirth-day").clear().type(new Date(b2.geboortedatum).getDate().toString());
		// cy.get("input#dateOfBirth-month").clear().type(new Date(b2.geboortedatum).getMonth().toString());
		cy.get("select#dateOfBirth-month").select(new Date(b2.geboortedatum).getMonth().toString());
		cy.get("input#dateOfBirth-year").clear().type(new Date(b2.geboortedatum).getFullYear().toString());
		cy.get("input#street").clear().type(b2.straatnaam);
		cy.get("input#houseNumber").clear().type(b2.huisnummer);
		cy.get("input#zipcode").clear().type(b2.postcode);
		cy.get("input#city").clear().type(b2.plaatsnaam);
		cy.get("input#phoneNumber").clear().type(b2.telefoonnummer);
		cy.get("input#mail").clear().type(b2.email);

		// Press submit
		cy.get("button").contains("Opslaan").click();
		cy.get(".chakra-toast").should("contain", "succesvol");
	});

	it("Deletes a burger", () => {
		const b = sampleBurgers[0];

		// Go to burgers list page
		cy.visit(Routes.Burger(b.id));

		// Check if we're on the right page
		cy.get("h2").should("contain", b.voornamen);
		cy.get("h2").should("contain", b.achternaam);
		cy.get("button[data-cy=actionsMenuButton]").trigger("click");

		// Press delete button
		cy.get("button").contains("Verwijderen").trigger("click");

		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(1000);

		cy.get("div").should("contain", "Burger verwijderen");

		// Press delete button in dialog
		cy.get("button[data-cy=inModal]").contains("Annuleren");
		cy.get("button[data-cy=inModal]").contains("Verwijderen").click();

		cy.get(".chakra-toast").should("contain", "verwijderd");
		cy.get("p").should("contain", "verwijderd");
	});

})