import "cypress-graphql-mock";
import Routes from "../../src/config/routes";
import sampleBurgers from "../fixtures/burgers.json";
import sampleAfspraken from "../fixtures/afspraken.json";
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
				},
				getAllOrganisaties: {
					organisaties: sampleOrganizations,
				},
				getOneOrganisatie: ({id}) => ({
					organisatie: sampleOrganizations.find(b => b.id === parseInt(id))
				}),
				getAllRubrieken: {
					rubrieken: sampleRubrieken,
				},
				getOneRubriek: ({id}) => ({
					rubriek: sampleRubrieken.find(b => b.id === parseInt(id))
				}),
				getAllAfspraken: {
					afspraken: sampleAfspraken,
				},
				getOneAfspraak: ({id}) => ({
					afspraak: sampleAfspraken.find(b => b.id === parseInt(id))
				}),		
			}
		});
	});
})

describe("Afspraken CRUD", () => {

	it("Shows afspraken for a burger", () => {
		const b = sampleBurgers[0];
		const a1 = sampleBurgers[0]["afspraken"][0]
		const a2 = sampleBurgers[0]["afspraken"][1]
		cy.visit(Routes.Burger(b.id));

		// check inkomsten afspraak
		cy.get("div").should("contain", a2.beschrijving);
		cy.get("div").should("contain", a2.bedrag);

		// check uitgave afspraak
		cy.get('button').contains('Uitgaven').click()
		cy.get("div").should("contain", a1.beschrijving);
		cy.get("div").should("contain", a1.bedrag);
	});

	it("Creates a afspraak", () => {
		// Go to create afspraak page
		const b = sampleBurgers[0];
		const a = sampleBurgers[0]["afspraken"][0];
		cy.visit(Routes.CreateBurgerAfspraken(b.id));

		// Todo: can't explain why, but for some reason it fails on a second /api/me call. (24-11-2020)
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(1000);

		// Check if we're on the right page
		cy.get("h2").should("contain", b.voornamen + " " + b.achternaam);

		// Fill the form
		cy.get("input#description").type(a.beschrijving);
		cy.get("select#organizationId").select(a.organisatie.weergaveNaam);
		cy.get("select#rekeningId").select(a.organisatie.rekeningen[0].rekeninghouder + " (" + a.organisatie.rekeningen[0].iban + ")") 

		cy.get("select#rubriekId").select(a.rubriek.naam);
		cy.get("input#amount").type(a.bedrag);
		cy.get("input#searchTerm").type(a.kenmerk);

		cy.get("input#startDate").type(a.startDatum);

		// Press submit
		cy.get("button").contains("Opslaan").click();
		cy.get(".chakra-toast").should("contain", "succesvol");
	});

	it("Updates an afspraak", () => {
		const a1 = sampleAfspraken[0]
		const a2 = sampleAfspraken[1]

		// Go to edit afspraak page
		cy.visit(Routes.EditAgreement(a1.id));

		// Todo: can't explain why, but for some reason it fails on a second /api/me call. (24-11-2020)
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(2000);

		// Check if we're on the right page
		cy.get("h2").should("contain", "Afspraak bewerken");

		// Fill the form
		cy.get("input#description").clear().type(a2.beschrijving);
		cy.get("select#organizationId").select(a2.organisatie.weergaveNaam);
		cy.get("select#rekeningId").select(a2.organisatie.rekeningen[0].rekeninghouder + " (" + a2.organisatie.rekeningen[0].iban + ")") 

		cy.get("select#rubriekId").select(a2.rubriek.naam);
		cy.get("input#amount").clear().type(a2.bedrag);
		cy.get("input#searchTerm").clear().type(a2.kenmerk);

		cy.get('div').contains('Eenmalig').click()
		cy.get("input#startDate").clear().type(a2.startDatum);

		// Press submit
		cy.get("button").contains("Opslaan").click();
		cy.get(".chakra-toast").should("contain", "succesvol");
	});

	it("Deletes a afspraak", () => {
		const b = sampleBurgers[0];

		// Go to burgers list page
		cy.visit(Routes.Burger(b.id));

		// Check if we're on the right page
		cy.get("h2").should("contain", b.voorletters);
		cy.get("h2").should("contain", b.achternaam);
		

		//cy.get("button[data-cy=actionsMenuButton]").trigger("click");
		cy.get("button[aria-label='Verwijderen']").first().click();

		// Press delete button in dialog
		cy.get('.css-1m097b9 > .chakra-icon').click()

		cy.get(".chakra-toast").should("contain", "verwijderd");
	});

})