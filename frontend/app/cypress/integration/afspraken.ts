import "cypress-graphql-mock";
import Routes from "../../src/config/routes";
import sampleBurgers from "../fixtures/burgers.json";
import sampleAfspraken from "../fixtures/afspraken.json";
import sampleOrganizations from "../fixtures/organizations.json";
import sampleRubrieken from "../fixtures/rubrieken.json";
import sampleRekeningen from "../fixtures/rekeningen.json"
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
				getAllRekeningen: {
					rekeningen: sampleRekeningen,
				},
				getOneRekening: ({id}) => ({
					rekening: sampleRekeningen.find(b => b.id === parseInt(id))
				}),
				getAllRubrieken: {
					rubrieken: sampleRubrieken,
				},
				getOneRubriek: ({id}) => ({
					rubriek: sampleRubrieken.find(b => b.id === parseInt(id))
				}),
				getAllOrganisaties: {
					organisaties: sampleOrganizations,
				},
				getOneOrganisatie: ({id}) => ({
					organisatie: sampleOrganizations.find(b => b.id === parseInt(id))
				}),
				getAllAfspraken: {
					afspraken: sampleAfspraken,
				},
				getOneAfspraak: ({id}) => ({
					afspraak: sampleAfspraken.find(b => b.id === parseInt(id))
				}),
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

describe("Afspraken CRUD", () => {

	it("Shows a a afspraken for a burger", () => {
		// Go to burgers list page
		const b = sampleBurgers[0];
		const a = sampleBurgers[0]["afspraken"][0]
		cy.visit(Routes.Burger(b.id));

		cy.get("div").should("contain", a.beschrijving);
		cy.get("div").should("contain", a.bedrag);
	});

	it("Creates a afspraak", () => {
		// Go to create afspraak page
		const b = sampleBurgers[0];
		const a = sampleBurgers[0]["afspraken"][0]
		cy.visit(Routes.CreateBurgerAgreement(b.id));

		// Todo: can't explain why, but for some reason it fails on a second /api/me call. (24-11-2020)
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(1000);

		cy.get("input#description").type(a.beschrijving);
		cy.get("input#organizationId").type(a.organisatie.id.toString());

		// Wait for rekening select to load
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(1000);
		
		cy.get("input#rekeningId").type(a.organisatie.rekeningen[0].id.toString());
		cy.get("input#rubriekId").type(a.rubriek.id.toString());
		cy.get("input#amount").type(a.bedrag);
		cy.get("input#searchTerm").type(a.kenmerk);

		// Click reocurring?
		cy.get("input#startDate-day").type(new Date(a.startDatum).getDate().toString());
		cy.get("select#startDate-month").type(new Date(a.startDatum).getMonth().toString());
		cy.get("input#startDate-year").type(new Date(a.startDatum).getFullYear().toString());
		cy.get("input#intervalNumber").type(a.interval.maanden.toString());

		// Press submit
		cy.get("button").contains("Opslaan").click();
		cy.get(".chakra-toast").should("contain", "succesvol");
	});

	it("Updates a afspraak", () => {
		const b = sampleBurgers[0];
		const a1 = sampleBurgers[0]["afspraken"][0]
		const a2 = sampleBurgers[0]["afspraken"][1]

		// Go to burger detail page
		cy.visit(Routes.CreateBurgerAgreement(b.id));

		// Todo: can't explain why, but for some reason it fails on a second /api/me call. (24-11-2020)
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(2000);

		// Check if we're on the right page
		cy.get("h2").should("contain", "Afspraak bewerken");

		// Fill the form
		cy.get("input#description").type(a.beschrijving);
		cy.get("input#organizationId").type(a.organisatie.id.toString());

		// Wait for rekening select to load
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(1000);
		
		cy.get("input#rekeningId").type(a2.organisatie.rekeningen[0].id.toString());
		cy.get("input#rubriekId").type(a2.rubriek.id.toString());
		cy.get("input#amount").type(a2.bedrag);
		cy.get("input#searchTerm").type(a2.kenmerk);

		// Click reocurring?
		cy.get("input#startDate-day").type(new Date(a2.startDatum).getDate().toString());
		cy.get("select#startDate-month").type(new Date(a2.startDatum).getMonth().toString());
		cy.get("input#startDate-year").type(new Date(a2.startDatum).getFullYear().toString());
		cy.get("input#intervalNumber").type(a2.interval.maanden.toString());

		// Press submit
		cy.get("button").contains("Opslaan").click();
		cy.get(".chakra-toast").should("contain", "succesvol");
	});

	xit("Deletes a afspraak", () => {
		const b = sampleBurgers[0];

		// Go to burgers list page
		cy.visit(Routes.Burger(b.id));

		// Check if we're on the right page
		cy.get("h2").should("contain", b.voornamen);
		cy.get("h2").should("contain", b.achternaam);
		

		// TODO: Press delete button
		//cy.get("button[data-cy=actionsMenuButton]").trigger("click");
		//cy.get("button").contains("Verwijderen").trigger("click");

		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(1000);

		// Press delete button in dialog
		//cy.get("button[data-cy=inModal]").contains("Annuleren");
		//cy.get("button[data-cy=inModal]").contains("Verwijderen").click();

		cy.get(".chakra-toast").should("contain", "verwijderd");
		cy.get("p").should("contain", "verwijderd");
	});

})