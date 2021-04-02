import "cypress-graphql-mock";
import Routes from "../../src/config/routes";
import {formatBurgerName} from "../../src/utils/things";
import sampleAfspraken from "../fixtures/afspraken.json";
import sampleBurgers from "../fixtures/burgers.json";
import sampleOrganizations from "../fixtures/organizations.json";
import sampleRubrieken from "../fixtures/rubrieken.json";
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
					burgers: sampleBurgers,
				},
				getOneBurger: ({id}) => ({
					burger: sampleBurgers.find(b => b.id === parseInt(id)),
				}),
				createBurger: (props) => ({
					createBurger: {
						burger: {
							...props,
							id: sampleBurgers[sampleBurgers.length - 1].id,
						}
					}
				}),
				updateBurger: (props) => ({
					ok: true,
					burger: props,
				}),
				deleteBurger: {
					ok: true,
				},
				getOneOrganisatie: ({id}) => ({
					organisatie: sampleOrganizations.find(b => b.id === parseInt(id)),
				}),
				getAfspraakFormData: () => ({
					rubrieken: sampleRubrieken,
					organisaties: sampleOrganizations,
				})
			}
		});
	});
})

xdescribe("Afspraken CRUD", () => {

	it("Shows afspraken for a burger", () => {
		const b = sampleBurgers[0];
		const a1 = sampleBurgers[0].afspraken[0];
		const a2 = sampleBurgers[0].afspraken[1];
		cy.visit(Routes.Burger(b.id));

		cy.get("div").should("contain", a2.beschrijving);
		cy.get("div").should("contain", a2.bedrag);
		cy.get("div").should("contain", a1.beschrijving);
		cy.get("div").should("contain", a1.bedrag);
	});

	it("Creates an afspraak", () => {
		// Go to create afspraak page
		const b = sampleBurgers[0];
		const a = sampleBurgers[0].afspraken[0];
		cy.visit(Routes.CreateBurgerAfspraken(b.id));

		// Todo: can't explain why, but for some reason it fails on a second /api/me call. (24-11-2020)
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(1000);

		// Check if we're on the right page
		cy.get("h2").should("contain", formatBurgerName(b));

		// Select rubriek 1
		cy.get("#rubriekId").click();
		cy.get("#rubriekId [class*=-menu]").find("[class*=-option]").eq(0).click();

		cy.get("input#description").type(a.beschrijving);

		// Select beneficiary
		cy.get("#beneficiaryId").click();
		cy.get("#beneficiaryId [class*=-menu]").find("[class*=-option]").eq(0).click();

		// Select rekening
		cy.get("#rekeningId").click();
		cy.get("#rekeningId [class*=-menu]").find("[class*=-option]").eq(0).click();

		cy.get("input#amount").type(a.bedrag);
		cy.get("input#zoektermen").type(a.zoektermen?.join(", "));
		cy.get("input#startDate").type(a.startDatum);

		// Press submit
		cy.get("button").contains("Opslaan").click();
		cy.get(".chakra-toast").should("contain", "succesvol");
	});

	it("Updates an afspraak", () => {
		const a1 = sampleAfspraken[0];
		const a2 = sampleAfspraken[1];

		// Go to edit afspraak page
		cy.visit(Routes.EditAfspraak(a1.id));

		// Todo: can't explain why, but for some reason it fails on a second /api/me call. (14-12-2020)
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(1000);

		// Check if we're on the right page
		cy.get("h2").should("contain", "Afspraak bewerken");

		// Select rubriek 1
		cy.get("#rubriekId").click();
		cy.get("#rubriekId [class*=-menu]").find("[class*=-option]").eq(0).click();

		cy.get("input#description").clear().type(a2.beschrijving);

		// Select beneficiary
		cy.get("#beneficiaryId").click();
		cy.get("#beneficiaryId [class*=-menu]").find("[class*=-option]").eq(0).click();

		// Select rekening
		cy.get("#rekeningId").click();
		cy.get("#rekeningId [class*=-menu]").find("[class*=-option]").eq(0).click();

		cy.get("input#amount").clear().type(a2.bedrag);
		cy.get("input#zoektermen").clear().type(a2.zoektermen?.join(", "));

		cy.get("div").contains("Eenmalig").click();
		cy.get("input#startDate").clear().type(a2.startDatum);

		// Press submit
		cy.get("button").contains("Opslaan").click();
		cy.get(".chakra-toast").should("contain", "succesvol");
	});

	it("Deletes an afspraak", () => {
		const b = sampleBurgers[0];

		// Go to burgers list page
		cy.visit(Routes.Burger(b.id));
		cy.get("h2").should("contain", formatBurgerName(b));
		cy.get("button[data-cy=deleteConfirmButton1]").first().click();
		cy.get("button[data-cy=deleteConfirmButton2]").first().click();
		cy.get(".chakra-toast").should("contain", "verwijderd");
	});

})