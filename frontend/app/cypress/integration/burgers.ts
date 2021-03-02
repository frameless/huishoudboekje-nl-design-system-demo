import "cypress-graphql-mock";
import moment from "moment";
import Routes from "../../src/config/routes";
import {formatBurgerName} from "../../src/utils/things";
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
				getAllBurgers: {
					gebruikers: sampleBurgers,
				},
				getOneBurger: ({id}) => ({
					gebruiker: sampleBurgers.find(b => b.id === parseInt(id))
				}),
				createBurger: (props) => ({
					createGebruiker: {
						gebruiker: {
							...props,
							id: sampleBurgers[sampleBurgers.length - 1].id
						}
					}
				}),
				updateBurger: (props) => ({
					ok: true,
					gebruiker: props
				}),
				deleteBurger: {
					ok: true,
				}
			}
		});
	});
})

describe("Burgers CRUD", () => {

	it("Shows a list of burgers", () => {
		// Go to burgers list page
		cy.visit(Routes.Burgers);

		sampleBurgers.forEach(b => {
			cy.get("div").should("contain", b.voornamen);
			cy.get("div").should("contain", b.achternaam);
		});
	});

	it("Shows a a single burger", () => {
		// Go to burgers list page
		const b = sampleBurgers[0];
		cy.visit(Routes.Burger(b.id));

		cy.get("div").should("contain", b.voornamen);
		cy.get("div").should("contain", b.achternaam);
	});

	it("Creates a burger", () => {
		// Go to burgers list page
		cy.visit(Routes.CreateBurger);

		// Todo: can't explain why, but for some reason it fails on a second /api/me call. (24-11-2020)
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(1000);

		// Fill the form
		const b = sampleBurgers[0];

		cy.get("input#voorletters").type(b.voorletters);
		cy.get("input#voornamen").type(b.voornamen);
		cy.get("input#achternaam").type(b.achternaam);
		cy.get("input#geboortedatum").type(moment(b.geboortedatum).format("L") + "{esc}");
		cy.get("input#straatnaam").type(b.straatnaam);
		cy.get("input#huisnummer").type(b.huisnummer);
		cy.get("input#postcode").type(b.postcode);
		cy.get("input#plaatsnaam").type(b.plaatsnaam);
		cy.get("input#telefoonnummer").type(b.telefoonnummer);
		cy.get("input#mail").type(b.email);

		// Press submit
		cy.get("button").contains("Opslaan").click();
		cy.get(".chakra-toast").should("contain", "succesvol");
	});

	it("Updates a burger", () => {
		const b1 = sampleBurgers[0];
		const b2 = sampleBurgers[1];

		// Go to burger detail page
		cy.visit(Routes.EditBurger(b1.id));

		// Todo: can't explain why, but for some reason it fails on a second /api/me call. (24-11-2020)
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(2000);

		// Check if we're on the right page
		cy.get("h2").should("contain", formatBurgerName(b1));
		cy.get("h2").should("contain", b1.achternaam);

		// Fill the form
		cy.get("input#voorletters").clear().type(b2.voorletters);
		cy.get("input#voornamen").clear().type(b2.voornamen);
		cy.get("input#achternaam").clear().type(b2.achternaam);
		cy.get("input#geboortedatum").clear().type(moment(b2.geboortedatum).format("L") + "{esc}");
		cy.get("input#straatnaam").clear().type(b2.straatnaam);
		cy.get("input#huisnummer").clear().type(b2.huisnummer);
		cy.get("input#postcode").clear().type(b2.postcode);
		cy.get("input#plaatsnaam").clear().type(b2.plaatsnaam);
		cy.get("input#telefoonnummer").clear().type(b2.telefoonnummer);
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
		cy.get("h2").should("contain", formatBurgerName(b));
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